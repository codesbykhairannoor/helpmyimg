import { AutoModel, AutoProcessor, env, pipeline, RawImage } from '@huggingface/transformers';

// Disable local file resolution inside Web Worker
env.allowLocalModels = false;

// Safely guard ONNX WASM threads when Cross-Origin Isolation headers are absent
if (env.backends?.onnx?.wasm) {
  const isolated = typeof self !== 'undefined' && Boolean((self as any).crossOriginIsolated);
  env.backends.onnx.wasm.numThreads = isolated ? Math.min(4, navigator.hardwareConcurrency || 4) : 1;
}

export type AiModelTier = 'standard' | 'pro';

let cachedDevice: 'webgpu' | 'wasm' | null = null;
let rmbgModel: any = null;
let rmbgProcessor: any = null;
let rmbgInitPromise: Promise<{ model: any; processor: any }> | null = null;

let birefnetPipeline: any = null;
let birefnetInitPromise: Promise<any> | null = null;

let upscalePipeline: any = null;
let upscaleInitPromise: Promise<any> | null = null;

let depthPipeline: any = null;
let depthInitPromise: Promise<any> | null = null;

async function detectComputeDevice(): Promise<'webgpu' | 'wasm'> {
  if (cachedDevice) return cachedDevice;
  try {
    const gpu = (navigator as any).gpu;
    if (gpu && typeof gpu.requestAdapter === 'function') {
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        cachedDevice = 'webgpu';
        return 'webgpu';
      }
    }
  } catch {
    // WebGPU unavailable in worker context
  }
  cachedDevice = 'wasm';
  return 'wasm';
}

function refineMattingAndDespill(rgba: Uint8ClampedArray, width: number, height: number): void {
  const numPixels = width * height;

  // 1. First pass: Apply smooth Hermite S-curve to alpha channel to eliminate staircase edges
  for (let i = 0; i < numPixels; i++) {
    const a = rgba[i * 4 + 3];
    if (a <= 6) {
      rgba[i * 4 + 3] = 0;
    } else if (a >= 246) {
      rgba[i * 4 + 3] = 255;
    } else {
      const t = (a - 6) / (246 - 6);
      const s = t * t * (3 - 2 * t);
      rgba[i * 4 + 3] = Math.round(s * 255);
    }
  }

  // 2. Sample background color from border/outer pixels where alpha is near 0
  let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
  // Sample along perimeter (top, bottom, left, right borders)
  for (let x = 0; x < width; x += 2) {
    const topIdx = x * 4;
    if (rgba[topIdx + 3] <= 10) {
      bgR += rgba[topIdx];
      bgG += rgba[topIdx + 1];
      bgB += rgba[topIdx + 2];
      bgCount++;
    }
    const botIdx = ((height - 1) * width + x) * 4;
    if (rgba[botIdx + 3] <= 10) {
      bgR += rgba[botIdx];
      bgG += rgba[botIdx + 1];
      bgB += rgba[botIdx + 2];
      bgCount++;
    }
  }
  for (let y = 0; y < height; y += 2) {
    const leftIdx = (y * width) * 4;
    if (rgba[leftIdx + 3] <= 10) {
      bgR += rgba[leftIdx];
      bgG += rgba[leftIdx + 1];
      bgB += rgba[leftIdx + 2];
      bgCount++;
    }
    const rightIdx = (y * width + (width - 1)) * 4;
    if (rgba[rightIdx + 3] <= 10) {
      bgR += rgba[rightIdx];
      bgG += rgba[rightIdx + 1];
      bgB += rgba[rightIdx + 2];
      bgCount++;
    }
  }

  // If perimeter had few pixels, sample general background pixels
  if (bgCount < 20) {
    const step = Math.max(1, Math.floor(numPixels / 1000));
    for (let i = 0; i < numPixels; i += step) {
      const idx = i * 4;
      if (rgba[idx + 3] <= 10) {
        bgR += rgba[idx];
        bgG += rgba[idx + 1];
        bgB += rgba[idx + 2];
        bgCount++;
      }
    }
  }

  if (bgCount > 0) {
    bgR = Math.round(bgR / bgCount);
    bgG = Math.round(bgG / bgCount);
    bgB = Math.round(bgB / bgCount);
  }

  // Detect if the sampled background has a strong saturated chroma (Red, Blue, Green backdrops)
  const isRedBg = bgR > 90 && bgR > bgG + 25 && bgR > bgB + 25;
  const isBlueBg = bgB > 90 && bgB > bgR + 25 && bgB > bgG + 25;
  const isGreenBg = bgG > 90 && bgG > bgR + 25 && bgG > bgB + 25;

  // 3. Second pass: Optical color unmixing & spill suppression on semi-transparent transition pixels
  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    const a = rgba[idx + 3];

    if (a > 0 && a < 250 && bgCount > 0) {
      const alphaNorm = a / 255;
      const r = rgba[idx];
      const g = rgba[idx + 1];
      const b = rgba[idx + 2];

      const cleanR = Math.min(255, Math.max(0, Math.round((r - (1 - alphaNorm) * bgR) / alphaNorm)));
      const cleanG = Math.min(255, Math.max(0, Math.round((g - (1 - alphaNorm) * bgG) / alphaNorm)));
      const cleanB = Math.min(255, Math.max(0, Math.round((b - (1 - alphaNorm) * bgB) / alphaNorm)));

      rgba[idx] = cleanR;
      rgba[idx + 1] = cleanG;
      rgba[idx + 2] = cleanB;
    }

    // 4. Spill suppression for saturated backdrop reflections on borders
    if (a > 0) {
      const r = rgba[idx];
      const g = rgba[idx + 1];
      const b = rgba[idx + 2];

      if (isRedBg) {
        // Neutralize red bounce on near-neutral objects (white collars, hair, gray tones)
        const maxOther = Math.max(g, b);
        if (r > maxOther + 12 && Math.abs(g - b) < 40) {
          rgba[idx] = Math.round(maxOther + (r - maxOther) * 0.25);
        }
      } else if (isBlueBg) {
        const maxOther = Math.max(r, g);
        if (b > maxOther + 12 && Math.abs(r - g) < 40) {
          rgba[idx + 2] = Math.round(maxOther + (b - maxOther) * 0.25);
        }
      } else if (isGreenBg) {
        const maxOther = Math.max(r, b);
        if (g > maxOther + 12 && Math.abs(r - g) < 40) {
          rgba[idx + 1] = Math.round(maxOther + (g - maxOther) * 0.25);
        }
      }
    }
  }
}

async function rawImageToPngBlob(raw: RawImage, applyRefinement: boolean = false): Promise<Blob> {
  const canvas = new OffscreenCanvas(raw.width, raw.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('OffscreenCanvas 2D context unavailable');

  const numPixels = raw.width * raw.height;
  const rgba = new Uint8ClampedArray(numPixels * 4);

  if (raw.channels === 4) {
    rgba.set(raw.data);
  } else if (raw.channels === 3) {
    for (let i = 0; i < numPixels; i++) {
      rgba[i * 4] = raw.data[i * 3];
      rgba[i * 4 + 1] = raw.data[i * 3 + 1];
      rgba[i * 4 + 2] = raw.data[i * 3 + 2];
      rgba[i * 4 + 3] = 255;
    }
  } else {
    for (let i = 0; i < numPixels; i++) {
      const v = raw.data[i];
      rgba[i * 4] = v;
      rgba[i * 4 + 1] = v;
      rgba[i * 4 + 2] = v;
      rgba[i * 4 + 3] = 255;
    }
  }

  if (applyRefinement) {
    refineMattingAndDespill(rgba, raw.width, raw.height);
  }

  ctx.putImageData(new ImageData(rgba, raw.width, raw.height), 0, 0);
  return canvas.convertToBlob({ type: 'image/png' });
}

async function loadInputRawImage(payload: { imageBlob?: Blob; imageUrl?: string }): Promise<RawImage> {
  if (payload.imageBlob) {
    return RawImage.fromBlob(payload.imageBlob);
  }
  if (payload.imageUrl) {
    return RawImage.fromURL(payload.imageUrl);
  }
  throw new Error('No image data provided.');
}

async function initStandardRmbg(onProgress: (status: string, progress: number) => void) {
  if (rmbgModel && rmbgProcessor) return { model: rmbgModel, processor: rmbgProcessor };
  if (rmbgInitPromise) return rmbgInitPromise;

  rmbgInitPromise = (async () => {
    try {
      const device = await detectComputeDevice();
      onProgress('downloading:0', 0);

      const loadWithDevice = async (targetDevice: 'webgpu' | 'wasm') => {
        return AutoModel.from_pretrained('briaai/RMBG-1.4', {
          // @ts-ignore - custom model type required for Bria RMBG-1.4
          config: { model_type: 'custom' },
          device: targetDevice,
          dtype: 'q8',
          progress_callback: (data: any) => {
            if (data.status === 'progress') {
              const pct = Math.round(data.progress || 0);
              onProgress(`downloading:${pct}`, pct);
            } else if (data.status === 'ready') {
              onProgress('ready', 100);
            }
          },
        });
      };

      try {
        rmbgModel = await loadWithDevice(device);
      } catch (webgpuErr) {
        if (device === 'webgpu') {
          cachedDevice = 'wasm';
          rmbgModel = await loadWithDevice('wasm');
        } else {
          throw webgpuErr;
        }
      }

      rmbgProcessor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
        config: {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: 'ImageFeatureExtractor',
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size: { width: 1024, height: 1024 },
        },
      });

      return { model: rmbgModel, processor: rmbgProcessor };
    } catch (err) {
      rmbgInitPromise = null;
      throw err;
    }
  })();

  return rmbgInitPromise;
}

async function initProBirefnet(onProgress: (status: string, progress: number) => void) {
  if (birefnetPipeline) return birefnetPipeline;
  if (birefnetInitPromise) return birefnetInitPromise;

  birefnetInitPromise = (async () => {
    try {
      const device = await detectComputeDevice();
      onProgress('downloading:0', 0);

      const loadBiRefNet = async (targetDevice: 'webgpu' | 'wasm') => {
        return pipeline('background-removal', 'onnx-community/BiRefNet_lite-ONNX', {
          device: targetDevice,
          dtype: targetDevice === 'webgpu' ? 'fp16' : 'q8',
          progress_callback: (data: any) => {
            if (data.status === 'progress') {
              const pct = Math.round(data.progress || 0);
              onProgress(`downloading:${pct}`, pct);
            } else if (data.status === 'ready') {
              onProgress('ready', 100);
            }
          },
        });
      };

      try {
        birefnetPipeline = await loadBiRefNet(device);
      } catch {
        if (device === 'webgpu') {
          birefnetPipeline = await loadBiRefNet('wasm');
        } else {
          throw new Error('BiRefNet load failed');
        }
      }

      return birefnetPipeline;
    } catch (err) {
      birefnetInitPromise = null;
      throw err;
    }
  })();

  return birefnetInitPromise;
}

async function initUpscalePipeline(onProgress: (status: string, progress: number) => void) {
  if (upscalePipeline) return upscalePipeline;
  if (upscaleInitPromise) return upscaleInitPromise;

  upscaleInitPromise = (async () => {
    try {
      const device = await detectComputeDevice();
      onProgress('downloading:0', 0);

      const loadSr = async (targetDevice: 'webgpu' | 'wasm') => {
        return pipeline('image-to-image', 'Xenova/swin2SR-lightweight-x2-64', {
          device: targetDevice,
          dtype: targetDevice === 'webgpu' ? 'fp16' : 'q8',
          progress_callback: (data: any) => {
            if (data.status === 'progress') {
              const pct = Math.round(data.progress || 0);
              onProgress(`downloading:${pct}`, pct);
            } else if (data.status === 'ready') {
              onProgress('ready', 100);
            }
          },
        });
      };

      try {
        upscalePipeline = await loadSr(device);
      } catch {
        if (device === 'webgpu') {
          upscalePipeline = await loadSr('wasm');
        } else {
          throw new Error('Swin2SR load failed');
        }
      }

      return upscalePipeline;
    } catch (err) {
      upscaleInitPromise = null;
      throw err;
    }
  })();

  return upscaleInitPromise;
}

async function initDepthPipeline(onProgress: (status: string, progress: number) => void) {
  if (depthPipeline) return depthPipeline;
  if (depthInitPromise) return depthInitPromise;

  depthInitPromise = (async () => {
    try {
      const device = await detectComputeDevice();
      onProgress('downloading:0', 0);

      const loadDepth = async (targetDevice: 'webgpu' | 'wasm') => {
        return pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', {
          device: targetDevice,
          dtype: 'q8',
          progress_callback: (data: any) => {
            if (data.status === 'progress') {
              const pct = Math.round(data.progress || 0);
              onProgress(`downloading:${pct}`, pct);
            } else if (data.status === 'ready') {
              onProgress('ready', 100);
            }
          },
        });
      };

      try {
        depthPipeline = await loadDepth(device);
      } catch {
        if (device === 'webgpu') {
          depthPipeline = await loadDepth('wasm');
        } else {
          throw new Error('Depth Anything load failed');
        }
      }

      return depthPipeline;
    } catch (err) {
      depthInitPromise = null;
      throw err;
    }
  })();

  return depthInitPromise;
}

async function runRmbgInference(
  image: RawImage,
  onProgress: (status: string, progress: number) => void
): Promise<Blob> {
  const { model, processor } = await initStandardRmbg(onProgress);
  onProgress('processing', 100);

  const { pixel_values } = await processor(image);
  const modelOutput = await model({ input: pixel_values });
  const rawTensor = modelOutput.output || modelOutput[0] || modelOutput;
  const tensor3D = rawTensor[0] || rawTensor;

  const mask = await RawImage.fromTensor(tensor3D.mul(255).to('uint8')).resize(image.width, image.height);

  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('OffscreenCanvas 2D context unavailable');

  const numPixels = image.width * image.height;
  const rgbaData = new Uint8ClampedArray(numPixels * 4);
  const isRGB = image.channels === 3;
  const isRGBA = image.channels === 4;
  const isGray = image.channels === 1;

  for (let i = 0; i < numPixels; i++) {
    if (isRGB) {
      rgbaData[i * 4] = image.data[i * 3];
      rgbaData[i * 4 + 1] = image.data[i * 3 + 1];
      rgbaData[i * 4 + 2] = image.data[i * 3 + 2];
    } else if (isRGBA) {
      rgbaData[i * 4] = image.data[i * 4];
      rgbaData[i * 4 + 1] = image.data[i * 4 + 1];
      rgbaData[i * 4 + 2] = image.data[i * 4 + 2];
    } else if (isGray) {
      rgbaData[i * 4] = image.data[i];
      rgbaData[i * 4 + 1] = image.data[i];
      rgbaData[i * 4 + 2] = image.data[i];
    }

    rgbaData[i * 4 + 3] = mask.data[i];
  }

  // Apply smooth anti-aliased matting and edge color despill
  refineMattingAndDespill(rgbaData, image.width, image.height);

  ctx.putImageData(new ImageData(rgbaData, image.width, image.height), 0, 0);
  return canvas.convertToBlob({ type: 'image/png' });
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  if (type === 'CHECK_CAPABILITIES') {
    const device = await detectComputeDevice();
    self.postMessage({ type: 'RESULT', id, payload: { webgpu: device === 'webgpu', device } });
    return;
  }

  if (type === 'INIT') {
    try {
      await initStandardRmbg((status, progress) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      });
      self.postMessage({ type: 'INIT_DONE', id });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
    return;
  }

  if (type === 'REMOVE_BG') {
    try {
      const reportProgress = (status: string, progress: number) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      };

      const image = await loadInputRawImage(payload);

      // Attempt BiRefNet Lite first (state-of-the-art bilateral segmentation)
      try {
        const segmenter = await initProBirefnet(reportProgress);
        reportProgress('processing', 100);
        const resultRaw: RawImage = await segmenter(image);
        const blob = await rawImageToPngBlob(resultRaw, true);
        self.postMessage({ type: 'RESULT', id, payload: blob });
        return;
      } catch (birefnetErr) {
        console.warn('[aiWorker] BiRefNet unavailable or memory limit, using RMBG-1.4 fallback:', birefnetErr);
      }

      // High-accuracy RMBG-1.4 fallback with matting refinement & despill
      const blob = await runRmbgInference(image, reportProgress);
      self.postMessage({ type: 'RESULT', id, payload: blob });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
    return;
  }

  if (type === 'UPSCALE_AI') {
    try {
      const reportProgress = (status: string, progress: number) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      };
      const upscaler = await initUpscalePipeline(reportProgress);
      reportProgress('processing', 100);

      let image = await loadInputRawImage(payload);
      // Guard input size to prevent WASM memory exhaustion on Swin2SR attention layers
      const maxInputSide = 640;
      if (image.width > maxInputSide || image.height > maxInputSide) {
        const scale = Math.min(maxInputSide / image.width, maxInputSide / image.height);
        image = await image.resize(
          Math.max(1, Math.round(image.width * scale)),
          Math.max(1, Math.round(image.height * scale))
        );
      }

      const outRaw: RawImage = await upscaler(image);
      const blob = await rawImageToPngBlob(outRaw);
      self.postMessage({ type: 'RESULT', id, payload: blob });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
    return;
  }

  if (type === 'DEPTH_ESTIMATE') {
    try {
      const reportProgress = (status: string, progress: number) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      };
      const depthEstimator = await initDepthPipeline(reportProgress);
      reportProgress('processing', 100);

      const image = await loadInputRawImage(payload);
      const result = await depthEstimator(image);
      const depthImg: RawImage = result.depth;
      const blob = await rawImageToPngBlob(depthImg);
      self.postMessage({ type: 'RESULT', id, payload: blob });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
  }
};
