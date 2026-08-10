import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Wand2, Type, Square, Layers, Download, Move, Palette } from 'lucide-react';

export const DesignSections: React.FC = () => {
              <Wand2 className="w-8 h-8 text-slate-400 group-hover:text-[#8B5CF6] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Start Canvas')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Open a blank canvas or import a photo.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#EC4899]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <Palette className="w-8 h-8 text-[#EC4899]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Design')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Add text, graphics, and apply filters.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <Download className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Export')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download the final masterpiece.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
