// src/components/workspace/tools/design/useDesign.ts
// Hook dedicated to Design Editor state

import { useState } from 'react';

export interface UseDesignReturn {
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
}

export function useDesign(): UseDesignReturn {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return {
    isEditorOpen,
    setIsEditorOpen,
  };
}
