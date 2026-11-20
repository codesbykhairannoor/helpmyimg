// src/components/workspace/tools/DesignEditorControl.tsx
// Kontrol Studio Editor Gambar Tingkat Lanjut berbasis WebGL GPU Shader & Canvas Layering

import React from 'react';
import { AdvancedStudioEditor } from './design/AdvancedStudioEditor';

interface DesignEditorControlProps {
  imageUrl: string;
  fileName?: string;
  onDownload: (dataUrl: string) => void;
  onClose?: () => void;
}

export const DesignEditorControl: React.FC<DesignEditorControlProps> = ({
  imageUrl,
  fileName,
  onDownload,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div className="w-full h-full min-h-[500px]">
      <AdvancedStudioEditor
        imageUrl={imageUrl}
        fileName={fileName}
        onClose={onClose || (() => {})}
        onSave={onDownload}
      />
    </div>
  );
};
