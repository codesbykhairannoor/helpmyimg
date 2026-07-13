// @refresh reset
import React from 'react';
import { 
  Scissors, 
  Minimize2, 
  Maximize2, 
  Image as ImageIcon, 
   Stamp,
   Crop,
  RotateCw,
  Pipette
} from 'lucide-react';

export type ToolCategory = 'optimize' | 'modify' | 'convert' | 'security' | 'edit';

export interface ToolItem {
  id: import('../utils/urlMapper').InternalTool;
  category: ToolCategory;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  isNew?: boolean;
}

export const tools: ToolItem[] = [
  {
    id: 'compress',
    category: 'optimize',
    icon: Minimize2,
    titleKey: 'nav.compress',
    descKey: 'grid.compressDesc',
  },
  {
    id: 'resize',
    category: 'modify',
    icon: Maximize2,
    titleKey: 'nav.resize',
    descKey: 'grid.resizeDesc',
  },
  {
    id: 'remove',
    category: 'optimize',
    icon: Scissors,
    titleKey: 'nav.removeBg',
    descKey: 'grid.removeDesc',
    isNew: true,
  },
  {
    id: 'convert',
    category: 'convert',
    icon: ImageIcon,
    titleKey: 'nav.convert',
    descKey: 'grid.convertDesc',
    isNew: true,
  },
  {
    id: 'watermark',
    category: 'security',
    icon: Stamp,
    titleKey: 'nav.watermark',
    descKey: 'grid.watermarkDesc',
    isNew: true,
  },
  {
    id: 'crop',
    category: 'edit',
    icon: Crop,
    titleKey: 'nav.crop',
    descKey: 'grid.cropDesc',
    isNew: true,
  },
  {
    id: 'rotate',
    category: 'edit',
    icon: RotateCw,
    titleKey: 'nav.rotate',
    descKey: 'grid.rotateDesc',
    isNew: true,
  },
  {
    id: 'picker',
    category: 'edit',
    icon: Pipette,
    titleKey: 'nav.picker',
    descKey: 'grid.pickerDesc',
    isNew: true,
  }
];

export const categories = [
  { id: 'all', labelKey: 'grid.catAll' },
  { id: 'optimize', labelKey: 'grid.catOptimize' },
  { id: 'modify', labelKey: 'grid.catModify' },
  { id: 'convert', labelKey: 'grid.catConvert' },
  { id: 'edit', labelKey: 'grid.catEdit' },
  { id: 'security', labelKey: 'grid.catSecurity' }
];
