import {
  AutoModel,
  AutoProcessor,
  VitMatteForImageMatting,
  env,
  pipeline,
  RawImage,
} from '@huggingface/transformers';
import { refineNeuralAlphaWithWasm, type VitMatteCropRunner } from '../utils/wasmMatting';

// Disable local file resolution inside Web Worker
env.allowLocalModels = false;

// Safely guard ONNX WASM threads when Cross-Origin Isolation headers are absent
if (env.backends?.onnx?.wasm) {
  const isolated = typeof self !== 'undefined' && Boolean((self as any).crossOriginIsolated);
  env.backends.onnx.wasm.numThreads = isolated ? Math.min(4, navigator.hardwareConcurrency || 4) : 1;
}

export type AiModelTier = 'standard' | 'pro';
export type GpuTier = 'webgpu-high' | 'webgpu-std' | 'wasm';

interface SegModelBundle {
  model: any;
  processor: any;
  device: 'webgpu' | 'wasm';
  modelId: string;
}

let cachedGpuTier: GpuTier | null = null;

// Cached Stage-1 segmentation models
let segBundleCache = new Map<string, SegModelBundle>();
let segInitPromises = new Map<string, Promise<SegModelBundle>>();

// Cached Stage-2 hair/fur trimap matting model (ViTMatte-S)
let vitMatteModel: any = null;
let vitMatteProcessor: any = null;
let vitMatteInitPromise: Promise<{ model: any; processor: any }> | null = null;

let upscalePipeline: any = null;
let upscaleInitPromise: Promise<any> | null = null;

let depthPipeline: any = null;
let depthInitPromise: Promise<any> | null = null;

async function detectGpuTier(): Promise<GpuTier> {
  if (cachedGpuTier) return cachedGpuTier;
  try {
    const gpu = (navigator as any).gpu;
    if (gpu && typeof gpu.requestAdapter === 'function') {
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        const maxStorageBuffers = adapter.limits?.maxStorageBuffersPerShaderStage ?? 0;
        // ONNX Runtime WebGPU kernels require at least 18 storage buffers per shader stage (Current: 17).
        // Adapters with <= 16 (e.g. Intel UHD/Iris Xe & integrated GPUs) will abort during OrtRun():
        // "numbers_storage_buffers_ <= limits_.maxStorageBuffersPerShaderStage was false. Current: 17, Max is 16".
        if (maxStorageBuffers >= 24) {
          cachedGpuTier = 'webgpu-high';
          return cachedGpuTier;
        }
        if (maxStorageBuffers >= 18) {
          cachedGpuTier = 'webgpu-std';
          return cachedGpuTier;
        }
      }
    }
  } catch {
    // WebGPU unavailable in worker context
  }
  cachedGpuTier = 'wasm';
  return cachedGpuTier;
}

async function detectComputeDevice(): Promise<'webgpu' | 'wasm'> {
  const tier = await detectGpuTier();
  return tier === 'wasm' ? 'wasm' : 'webgpu';
}

function rawImageToRgba(raw: RawImage): Uint8ClampedArray {
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
  return rgba;
}

async function rgbaToPngBlob(rgba: Uint8ClampedArray, width: number, height: number): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('OffscreenCanvas 2D context unavailable');
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height), 0, 0);
  return canvas.convertToBlob({ type: 'image/png' });
}

async function rawImageToPngBlob(raw: RawImage): Promise<Blob> {
  const rgba = rawImageToRgba(raw);
  return rgbaToPngBlob(rgba, raw.width, raw.height);
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

async function initSegModel(
  modelId: string,
  targetDevice: 'webgpu' | 'wasm',
  dtype: 'fp16' | 'fp32' | 'q8',
  onProgress: (status: string, progress: number) => void
): Promise<SegModelBundle> {
  const cacheKey = `${modelId}::${targetDevice}::${dtype}`;
  const cached = segBundleCache.get(cacheKey);
  if (cached) return cached;

  const existingPromise = segInitPromises.get(cacheKey);
  if (existingPromise) return existingPromise;

  const promise = (async () => {
    try {
      onProgress('downloading:0', 0);

      const isRmbg = modelId === 'briaai/RMBG-1.4';
      const model = await AutoModel.from_pretrained(modelId, {
        ...(isRmbg ? { config: { model_type: 'custom' } as any } : {}),
        device: targetDevice,
        dtype,
        progress_callback: (data: any) => {
          if (data.status === 'progress') {
            const pct = Math.round(data.progress || 0);
            onProgress(`downloading:${pct}`, pct);
          } else if (data.status === 'ready') {
            onProgress('ready', 100);
          }
        },
      });

      const processor = isRmbg
        ? await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
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
        })
        : await AutoProcessor.from_pretrained(modelId, {});

      const bundle: SegModelBundle = { model, processor, device: targetDevice, modelId };
      segBundleCache.set(cacheKey, bundle);
      return bundle;
    } catch (err) {
      segInitPromises.delete(cacheKey);
      throw err;
    }
  })();

  segInitPromises.set(cacheKey, promise);
  return promise;
}

async function initVitMatte(
  onProgress?: (status: string, progress: number) => void
): Promise<{ model: any; processor: any }> {
  if (vitMatteModel && vitMatteProcessor) {
    return { model: vitMatteModel, processor: vitMatteProcessor };
  }
  if (vitMatteInitPromise) return vitMatteInitPromise;

  vitMatteInitPromise = (async () => {
    try {
      // Quantized ViTMatte-S (26.2 MB) runs fast and reliably on WASM without GPU storage-buffer issues
      const [processor, model] = await Promise.all([
        AutoProcessor.from_pretrained('Xenova/vitmatte-small-distinctions-646'),
        VitMatteForImageMatting.from_pretrained('Xenova/vitmatte-small-distinctions-646', {
          device: 'wasm',
          dtype: 'q8',
          progress_callback: (data: any) => {
            if (onProgress && data.status === 'progress') {
              const pct = Math.round(data.progress || 0);
              onProgress(`downloading:${pct}`, pct);
            }
          },
        }),
      ]);
      vitMatteProcessor = processor;
      vitMatteModel = model;
      return { model, processor };
    } catch (err) {
      vitMatteInitPromise = null;
      throw err;
    }
  })();

  return vitMatteInitPromise;
}

async function runSegBundleInference(
  bundle: SegModelBundle,
  image: RawImage
): Promise<{ rawMask: Float32Array; mw: number; mh: number }> {
  const inputs = await bundle.processor(image);
  const modelSession = bundle.model.sessions?.['model'];
  const inputNames: string[] = modelSession?.inputNames ?? ['pixel_values'];
  const outputNames: string[] = modelSession?.outputNames ?? ['output'];

  const feeds: Record<string, any> = {};
  if (inputNames.includes('pixel_values')) {
    feeds.pixel_values = inputs.pixel_values;
  } else {
    feeds[inputNames[0]] = inputs.pixel_values;
  }

  const output = await bundle.model(feeds);
  const outTensor = output[outputNames[0]] || output.output || output.logits || output[0];
  if (!outTensor || !outTensor.data || !outTensor.dims) {
    throw new Error(`Invalid segmentation tensor output from ${bundle.modelId}`);
  }

  const dims: number[] = outTensor.dims;
  const mh = dims[dims.length - 2];
  const mw = dims[dims.length - 1];
  const planeSize = mw * mh;

  const rawData = outTensor.data;
  const rawMask = new Float32Array(planeSize);
  for (let i = 0; i < planeSize; i++) {
    rawMask[i] = Number(rawData[i]);
  }

  // Guard against broken GPU shader NaNs or constant degenerate masks
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (let i = 0; i < planeSize; i++) {
    const v = rawMask[i];
    if (Number.isNaN(v)) {
      throw new Error(`NaN encountered in segmentation output from ${bundle.modelId}`);
    }
    if (v < minVal) minVal = v;
    if (v > maxVal) maxVal = v;
  }
  if (maxVal - minVal < 1e-4) {
    throw new Error(`Degenerate constant mask produced by ${bundle.modelId} on ${bundle.device}`);
  }

  return { rawMask, mw, mh };
}

async function runStage1Segmentation(
  image: RawImage,
  modelTier: AiModelTier,
  onProgress: (status: string, progress: number) => void
): Promise<{ rawMask: Float32Array; mw: number; mh: number; modelId: string }> {
  const gpuTier = await detectGpuTier();

  // Ordered candidate cascade tailored to hardware & tier
  const candidates: Array<{ modelId: string; device: 'webgpu' | 'wasm'; dtype: 'fp16' | 'fp32' | 'q8' }> = [];

  if (gpuTier === 'webgpu-high') {
    candidates.push({ modelId: 'onnx-community/BiRefNet_lite-ONNX', device: 'webgpu', dtype: 'fp16' });
    candidates.push({ modelId: 'JONNYVERSE/birefnet-lite-512', device: 'webgpu', dtype: 'fp16' });
  } else if (gpuTier === 'webgpu-std') {
    candidates.push({ modelId: 'JONNYVERSE/birefnet-lite-512', device: 'webgpu', dtype: 'fp16' });
  }

  if (modelTier === 'pro') {
    candidates.push({ modelId: 'JONNYVERSE/birefnet-lite-512', device: 'wasm', dtype: 'fp32' });
  }
  candidates.push({ modelId: 'briaai/RMBG-1.4', device: 'wasm', dtype: 'q8' });

  let lastErr: any = null;
  for (const cand of candidates) {
    try {
      const bundle = await initSegModel(cand.modelId, cand.device, cand.dtype, onProgress);
      onProgress('processing', 100);
      const { rawMask, mw, mh } = await runSegBundleInference(bundle, image);
      return { rawMask, mw, mh, modelId: cand.modelId };
    } catch (err) {
      lastErr = err;
      console.warn(`[aiWorker] Stage-1 candidate ${cand.modelId} (${cand.device}/${cand.dtype}) failed:`, err);
      const key = `${cand.modelId}::${cand.device}::${cand.dtype}`;
      segBundleCache.delete(key);
      segInitPromises.delete(key);
      if (cand.device === 'webgpu') {
        cachedGpuTier = 'wasm';
      }
    }
  }

  throw lastErr || new Error('All background removal segmentation models failed');
}

function createVitMatteRunner(
  onProgress?: (status: string, progress: number) => void
): VitMatteCropRunner {
  return async (cropRgb, cropTrimap, cropW, cropH) => {
    const { model, processor } = await initVitMatte(onProgress);
    const rgbImg = new RawImage(new Uint8ClampedArray(cropRgb), cropW, cropH, 3);
    const trimapImg = new RawImage(new Uint8ClampedArray(cropTrimap), cropW, cropH, 1);

    const inputs = await processor(rgbImg, trimapImg);
    const { alphas } = await model(inputs);
    if (!alphas || !alphas.data || !alphas.dims) {
      return null;
    }

    const padW = alphas.dims[alphas.dims.length - 1];
    return {
      alphas: new Float32Array(alphas.data),
      padW,
    };
  };
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

self.onmessage = async (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  if (type === 'CHECK_CAPABILITIES') {
    const gpuTier = await detectGpuTier();
    self.postMessage({
      type: 'RESULT',
      id,
      payload: { webgpu: gpuTier !== 'wasm', device: gpuTier === 'wasm' ? 'wasm' : 'webgpu', gpuTier },
    });
    return;
  }

  if (type === 'INIT') {
    try {
      const gpuTier = await detectGpuTier();
      const reportProgress = (status: string, progress: number) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      };
      if (gpuTier === 'webgpu-high') {
        try {
          await initSegModel('onnx-community/BiRefNet_lite-ONNX', 'webgpu', 'fp16', reportProgress);
        } catch {
          cachedGpuTier = 'wasm';
          await initSegModel('briaai/RMBG-1.4', 'wasm', 'q8', reportProgress);
        }
      } else if (gpuTier === 'webgpu-std') {
        try {
          await initSegModel('JONNYVERSE/birefnet-lite-512', 'webgpu', 'fp16', reportProgress);
        } catch {
          cachedGpuTier = 'wasm';
          await initSegModel('briaai/RMBG-1.4', 'wasm', 'q8', reportProgress);
        }
      } else {
        await initSegModel('briaai/RMBG-1.4', 'wasm', 'q8', reportProgress);
      }
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

      const modelTier: AiModelTier = payload?.modelTier === 'pro' ? 'pro' : 'standard';
      const image = await loadInputRawImage(payload);
      const rgba = rawImageToRgba(image);

      // Stage 1: Dichotomous / Saliency Neural Segmentation (raw float32 tensor, no premature uint8 truncation)
      const { rawMask, mw, mh, modelId } = await runStage1Segmentation(image, modelTier, reportProgress);

      // Stage 2 + Stage 3:
      // Native C-WASM Bicubic Upsample -> Island Cleaner -> Trimap + ViTMatte-S (26MB) Hair/Fur Refinement
      // -> 3x3 RGB Fast Guided Filter -> Photoroom 2-Pass Blur-Fusion Foreground Color Decontamination
      reportProgress('processing', 100);

      // Use ViTMatte-S edge refinement when in PRO mode OR when Stage-1 was RMBG-1.4 / BiRefNet-512
      // (BiRefNet-1024 already has razor-sharp resolution, though PRO mode still refines hair with ViTMatte-S!)
      const useVitMatte =
        modelTier === 'pro' ||
        modelId === 'briaai/RMBG-1.4' ||
        modelId === 'JONNYVERSE/birefnet-lite-512';

      const vitmatteMaxSide = modelTier === 'pro' ? 672 : 512;
      const finalRgba = await refineNeuralAlphaWithWasm({
        rawMask,
        maskWidth: mw,
        maskHeight: mh,
        rgba,
        width: image.width,
        height: image.height,
        vitmatteRunner: useVitMatte ? createVitMatteRunner() : null,
        vitmatteMaxSide,
        enableBlurFusion: true,
      });

      const blob = await rgbaToPngBlob(finalRgba, image.width, image.height);
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
