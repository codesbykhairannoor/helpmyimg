import React, { useState, useEffect } from 'react';
import { ScanFace, UserPlus, Download, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export interface BlurBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BlurFaceControlProps {
  imageElement: HTMLImageElement | null;
  boxes: BlurBox[];
  setBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  mode: 'auto' | 'manual';
  setMode: (mode: 'auto' | 'manual') => void;
  onDownload: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const BlurFaceControl: React.FC<BlurFaceControlProps> = ({
  imageElement,
  boxes,
  setBoxes,
  mode,
  setMode,
  onDownload,
  onReset,
  isProcessing
}) => {
  const [detector, setDetector] = useState<FaceDetector | null>(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const loadDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU"
          },
          runningMode: "IMAGE"
        });
        setDetector(faceDetector);
      } catch (err) {
        console.error("Failed to load face detector", err);
      }
    };
    loadDetector();
  }, []);

  const handleAutoDetect = async () => {
    if (!detector || !imageElement) return;
    setDetecting(true);
    
    // Process image
    const detections = detector.detect(imageElement);
    
    const newBoxes = detections.detections.map((d, i) => {
      // Bounding box from MediaPipe is usually in pixels relative to original image
      const bb = d.boundingBox;
      if (!bb) return null;
      return {
        id: `auto_${Date.now()}_${i}`,
        x: bb.originX,
        y: bb.originY,
        width: bb.width,
        height: bb.height
      };
    }).filter(Boolean) as BlurBox[];
    
    setBoxes(newBoxes);
    setDetecting(false);
  };



  // Automatically run detection when mode switches to 'auto' if no boxes exist
  useEffect(() => {
    if (mode === 'auto' && boxes.length === 0 && detector && imageElement && !detecting) {
      handleAutoDetect();
    }
  }, [mode, detector, imageElement]);

  return (
    <div className="flex flex-col h-full bg-dark-900 overflow-y-auto custom-scrollbar">
      <div className="p-5 border-b border-dark-600">
        <h3 className="text-xl font-heading font-bold text-white mb-1 flex items-center gap-2">
          <ScanFace className="w-5 h-5 text-neon-pink" />
          Blur Face Options
        </h3>
        <p className="text-xs text-slate-400 font-medium">Protect privacy by blurring faces.</p>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">
        
        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('auto')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative ${
              mode === 'auto' 
                ? 'border-neon-cyan bg-neon-cyan/10' 
                : 'border-dark-600 bg-dark-800 hover:border-dark-500'
            }`}
          >
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-neon-cyan flex items-center justify-center">
               {mode === 'auto' && <div className="w-2 h-2 rounded-full bg-neon-cyan" />}
            </div>
            <ScanFace className={`w-8 h-8 mb-2 ${mode === 'auto' ? 'text-neon-cyan' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold ${mode === 'auto' ? 'text-white' : 'text-slate-400'}`}>Automatic</span>
            <span className="text-[10px] text-neon-cyan absolute top-2 right-2 bg-neon-cyan/20 px-1.5 py-0.5 rounded-full">RECOMMENDED</span>
          </button>
          
          <button
            onClick={() => setMode('manual')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative ${
              mode === 'manual' 
                ? 'border-neon-pink bg-neon-pink/10' 
                : 'border-dark-600 bg-dark-800 hover:border-dark-500'
            }`}
          >
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-neon-pink flex items-center justify-center">
               {mode === 'manual' && <div className="w-2 h-2 rounded-full bg-neon-pink" />}
            </div>
            <UserPlus className={`w-8 h-8 mb-2 ${mode === 'manual' ? 'text-neon-pink' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold ${mode === 'manual' ? 'text-white' : 'text-slate-400'}`}>Customised</span>
          </button>
        </div>

        {/* Action Area */}
        <div className="bg-dark-800 p-5 rounded-2xl border border-dark-600/50 flex flex-col gap-4">
          {mode === 'auto' ? (
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-4">AI will automatically detect faces.</p>
              <button 
                onClick={handleAutoDetect} 
                disabled={detecting || !detector}
                className="w-full py-3 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {detecting ? (
                  <span className="animate-pulse">Detecting...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                    Re-Scan Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-4">Click and drag on the image to draw custom blur areas.</p>
              {boxes.length > 0 && (
                <button 
                  onClick={() => setBoxes([])}
                  className="w-full py-3 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Clear All Areas
                </button>
              )}
            </div>
          )}
          
          {boxes.length > 0 && (
            <div className="mt-4 border-t border-dark-600 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Total Areas: {boxes.length}</span>
                <button onClick={() => setBoxes([])} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-dark-600 bg-dark-900/90 backdrop-blur-md sticky bottom-0 z-10 flex gap-3">
        <button
          onClick={onReset}
          className="p-4 rounded-xl bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-700 transition-colors border border-dark-600"
          title="Reset"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        
        <button
          onClick={onDownload}
          disabled={isProcessing}
          className="flex-1 py-4 bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 font-extrabold rounded-xl hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
        >
          <Download className="w-5 h-5" />
          Blur Face
        </button>
      </div>
    </div>
  );
};
