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
  ScanFace,
  Wand2,
  Palette,
  Eraser,
  Pipette
} from 'lucide-react';

export type ToolCategory = 'optimize' | 'modify' | 'security' | 'edit';

export interface ToolItem {
  id: import('../utils/urlMapper').InternalTool;
  category: ToolCategory;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  isNew?: boolean;
}

export const tools: ToolItem[] = [
  // Optimize Category (3 items)
  {
    id: 'remove',
    category: 'optimize',
    icon: Scissors,
    titleKey: 'nav.removeBg',
    descKey: 'grid.removeDesc',
    isNew: true,
  },
  {
    id: 'compress',
    category: 'optimize',
    icon: Minimize2,
    titleKey: 'nav.compress',
    descKey: 'grid.compressDesc',
  },
  {
    id: 'convert',
    category: 'optimize',
    icon: ImageIcon,
    titleKey: 'nav.convert',
    descKey: 'grid.convertDesc',
    isNew: true,
  },

  // Modify Category (3 items)
  {
    id: 'resize',
    category: 'modify',
    icon: Maximize2,
    titleKey: 'nav.resize',
    descKey: 'grid.resizeDesc',
  },
  {
    id: 'crop',
    category: 'modify',
    icon: Crop,
    titleKey: 'nav.crop',
    descKey: 'grid.cropDesc',
    isNew: true,
  },
  {
    id: 'rotate',
    category: 'modify',
    icon: RotateCw,
    titleKey: 'nav.rotate',
    descKey: 'grid.rotateDesc',
    isNew: true,
  },

  // Edit Category (3 items)
  {
    id: 'color',
    category: 'edit',
    icon: Palette,
    titleKey: 'nav.color',
    descKey: 'grid.colorDesc',
    isNew: true,
  },
  {
    id: 'design',
    category: 'edit',
    icon: Wand2,
    titleKey: 'nav.design',
    descKey: 'grid.designDesc',
    isNew: true,
  },
  {
    id: 'picker',
    category: 'edit',
    icon: Pipette,
    titleKey: 'nav.picker',
    descKey: 'grid.pickerDesc',
    isNew: true,
  },

  // Security Category (3 items)
  {
    id: 'watermark',
    category: 'security',
    icon: Stamp,
    titleKey: 'nav.watermark',
    descKey: 'grid.watermarkDesc',
  },
  {
    id: 'blurface',
    category: 'security',
    icon: ScanFace,
    titleKey: 'nav.blurface',
    descKey: 'grid.blurfaceDesc',
    isNew: true,
  },
  {
    id: 'brush',
    category: 'security',
    icon: Eraser,
    titleKey: 'tab.brush',
    descKey: 'brush.desc',
    isNew: true,
  }
];

export const categories = [
  { id: 'all', labelKey: 'grid.catAll' },
  { id: 'modify', labelKey: 'grid.catModify' },
  { id: 'edit', labelKey: 'grid.catEdit' },
  { id: 'optimize', labelKey: 'grid.catOptimize' },
  { id: 'security', labelKey: 'grid.catSecurity' }
];
