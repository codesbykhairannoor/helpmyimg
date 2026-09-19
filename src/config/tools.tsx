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
  defaultTitle: string;
  defaultDesc: string;
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
    defaultTitle: 'Remove Background',
    defaultDesc: 'Quickly remove image backgrounds with high accuracy. Instantly detect subjects and cut them out.',
    isNew: true,
  },
  {
    id: 'compress',
    category: 'optimize',
    icon: Minimize2,
    titleKey: 'nav.compress',
    descKey: 'grid.compressDesc',
    defaultTitle: 'Compress Image',
    defaultDesc: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.',
  },
  {
    id: 'convert',
    category: 'optimize',
    icon: ImageIcon,
    titleKey: 'nav.convert',
    descKey: 'grid.convertDesc',
    defaultTitle: 'Convert Format',
    defaultDesc: 'Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC, or RAW format images to JPG in bulk with ease.',
    isNew: true,
  },

  // Modify Category (3 items)
  {
    id: 'resize',
    category: 'modify',
    icon: Maximize2,
    titleKey: 'nav.resize',
    descKey: 'grid.resizeDesc',
    defaultTitle: 'Resize Image',
    defaultDesc: 'Define your dimensions, by percent or pixel, and resize your JPG, PNG, SVG, and GIF images.',
  },
  {
    id: 'crop',
    category: 'modify',
    icon: Crop,
    titleKey: 'nav.crop',
    descKey: 'grid.cropDesc',
    defaultTitle: 'Crop Image',
    defaultDesc: 'Crop JPG, PNG, or GIFs with ease. Choose pixels to define your rectangle.',
    isNew: true,
  },
  {
    id: 'rotate',
    category: 'modify',
    icon: RotateCw,
    titleKey: 'nav.rotate',
    descKey: 'grid.rotateDesc',
    defaultTitle: 'Rotate Image',
    defaultDesc: 'Rotate many images JPG, PNG or GIF at the same time with flip support.',
    isNew: true,
  },

  // Edit Category (3 items)
  {
    id: 'color',
    category: 'edit',
    icon: Palette,
    titleKey: 'nav.color',
    descKey: 'grid.colorDesc',
    defaultTitle: 'Change Background Color',
    defaultDesc: 'Change passport photo background color to official red/blue or apply studio gradients locally and instantly.',
    isNew: true,
  },
  {
    id: 'design',
    category: 'edit',
    icon: Wand2,
    titleKey: 'nav.design',
    descKey: 'grid.designDesc',
    defaultTitle: 'Design Editor',
    defaultDesc: 'Full-featured image studio: filters, draw, stickers, frames, and shapes.',
    isNew: true,
  },
  {
    id: 'picker',
    category: 'edit',
    icon: Pipette,
    titleKey: 'nav.picker',
    descKey: 'grid.pickerDesc',
    defaultTitle: 'Color Picker',
    defaultDesc: 'Extract color codes and color palettes from any image with the eyedropper tool.',
    isNew: true,
  },

  // Security Category (3 items)
  {
    id: 'watermark',
    category: 'security',
    icon: Stamp,
    titleKey: 'nav.watermark',
    descKey: 'grid.watermarkDesc',
    defaultTitle: 'Watermark Image',
    defaultDesc: 'Stamp an image or text over your images in seconds. Choose the typography, transparency and position.',
  },
  {
    id: 'blurface',
    category: 'security',
    icon: ScanFace,
    titleKey: 'nav.blurface',
    descKey: 'grid.blurfaceDesc',
    defaultTitle: 'Blur Face & Plate',
    defaultDesc: 'Automatically detect and blur faces or apply custom censorship boxes.',
    isNew: true,
  },
  {
    id: 'brush',
    category: 'security',
    icon: Eraser,
    titleKey: 'tab.brush',
    descKey: 'brush.desc',
    defaultTitle: 'Magic Brush Eraser',
    defaultDesc: 'Manually restore or erase parts of your image for perfect edges.',
    isNew: true,
  }
];

export const categories = [
  { id: 'modify', labelKey: 'grid.catModify', defaultLabel: 'Modify' },
  { id: 'edit', labelKey: 'grid.catEdit', defaultLabel: 'Edit' },
  { id: 'optimize', labelKey: 'grid.catOptimize', defaultLabel: 'Optimize' },
  { id: 'security', labelKey: 'grid.catSecurity', defaultLabel: 'Security' }
];
