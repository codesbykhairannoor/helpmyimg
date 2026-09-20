import { AutoModel, AutoProcessor, env, RawImage } from '@huggingface/transformers';

// Nonaktifkan proxy file lokal agar tidak terjadi CORS error di Web Worker
env.allowLocalModels = false;

let model: any = null;
let processor: any = null;

// Mengatur status inisialisasi agar tidak terjadi race condition
let isInitializing = false;

async function initModel(onProgress: (status: string, progress: number) => void) {
  if (model && processor) return { model, processor };
  
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100));
    }
    return { model, processor };
  }

  isInitializing = true;
  try {
    onProgress('downloading:0', 0);
    
    // Load state-of-the-art Bria RMBG-1.4 model (8-bit Quantized)
    model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
      // @ts-ignore
      config: { model_type: 'custom' },
      dtype: 'q8',
      progress_callback: (data: any) => {
         if (data.status === 'progress') {
            const pct = Math.round(data.progress || 0);
            onProgress(`downloading:${pct}`, pct);
         } else if (data.status === 'ready') {
            onProgress(`ready`, 100);
         }
      }
    });

    processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: "ImageFeatureExtractor",
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: { width: 1024, height: 1024 }
      }
    });
    
    return { model, processor };
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  if (type === 'INIT') {
    try {
      await initModel((status, progress) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      });
      self.postMessage({ type: 'INIT_DONE', id });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
  } 
  
  else if (type === 'REMOVE_BG') {
    try {
      const { imageUrl } = payload;

      const { model, processor } = await initModel((status, progress) => {
        self.postMessage({ type: 'PROGRESS', id, payload: { status, progress } });
      });

      self.postMessage({ type: 'PROGRESS', id, payload: { status: 'processing', progress: 100 } });
      
      let image: RawImage;
      if (payload.imageBlob) {
        image = await RawImage.fromBlob(payload.imageBlob);
      } else if (payload.imageUrl) {
        image = await RawImage.fromURL(payload.imageUrl);
      } else {
        throw new Error("No image data provided.");
      }
      
      const { pixel_values } = await processor(image);
      const modelOutput = await model({ input: pixel_values });
      const rawTensor = modelOutput.output || modelOutput[0] || modelOutput;
      const tensor3D = rawTensor[0] || rawTensor;

      const mask = await RawImage.fromTensor(tensor3D.mul(255).to('uint8')).resize(image.width, image.height);
      
      // Buat canvas offline menggunakan OffscreenCanvas
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Gagal membuat konteks OffscreenCanvas.");

      // Buat RGBA data array
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
        
        // Aplikasikan alpha channel langsung dari mask data (1 channel grayscale)
        rgbaData[i * 4 + 3] = mask.data[i]; 
      }

      const imgDataObj = new ImageData(rgbaData, image.width, image.height);
      ctx.putImageData(imgDataObj, 0, 0);
      
      const blob = await canvas.convertToBlob({ type: 'image/png' });

      self.postMessage({ type: 'RESULT', id, payload: blob });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', id, payload: error.message });
    }
  }
};
