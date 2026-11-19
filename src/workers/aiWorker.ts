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

async function rawImageToPngBlob(raw: RawImage): Promise<Blob> {
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

    let alpha = mask.data[i];
    if (alpha < 20) alpha = 0;
    else if (alpha > 238) alpha = 255;
    rgbaData[i * 4 + 3] = alpha;
  }

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
      const modelTier: AiModelTier = payload.modelTier === 'pro' ? 'pro' : 'standard';

      if (modelTier === 'pro') {
        try {
          const segmenter = await initProBirefnet(reportProgress);
          reportProgress('processing', 100);
          const resultRaw: RawImage = await segmenter(image);
          const blob = await rawImageToPngBlob(resultRaw);
          self.postMessage({ type: 'RESULT', id, payload: blob });
          return;
        } catch (proErr) {
          console.warn('[aiWorker] PRO BiRefNet fallback to RMBG-1.4:', proErr);
        }
      }

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
