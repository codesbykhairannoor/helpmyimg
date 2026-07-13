import React from 'react';
import FilerobotImageEditor from 'react-filerobot-image-editor';

interface DesignEditorControlProps {
  imageUrl: string;
  onDownload: (dataUrl: string) => void;
}

export const DesignEditorControl: React.FC<DesignEditorControlProps> = ({ imageUrl, onDownload }) => {
  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0 w-full h-full z-50">
      <FilerobotImageEditor
        source={imageUrl}
        onSave={(editedImageObject) => {
          if (editedImageObject && editedImageObject.imageBase64) {
            onDownload(editedImageObject.imageBase64);
          }
        }}
        annotationsCommon={{
          fill: '#000000',
        }}
        Text={{ text: 'HelpMyIMG' }}
        savingPixelRatio={4}
        previewPixelRatio={Math.max(1, window.devicePixelRatio)}
        theme={{
          colors: {
            primaryBg: '#0f172a',
            primaryBgHover: '#1e293b',
            secondaryBg: '#1e293b',
            secondaryBgHover: '#334155',
            secondaryBgOpacity: 'rgba(30, 41, 59, 0.5)',
            text: '#f8fafc',
            textHover: '#38bdf8',
            textMute: '#94a3b8',
            textWarn: '#f87171',
            secondaryBgSelected: '#0ea5e9',
            button: {
              primary: '#0ea5e9',
              secondary: '#334155',
              success: '#10b981',
              danger: '#ef4444',
            }
          },
          typography: {
            fontFamily: '"Inter", sans-serif',
          }
        }}
      />
    </div>
  );
};
