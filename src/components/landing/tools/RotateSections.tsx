import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { RotateCw, FlipHorizontal, FlipVertical, Image as ImageIcon, Download, SlidersHorizontal, MousePointerClick } from 'lucide-react';

export const RotateSections: React.FC = () => {
              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#05DAED] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Upload')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Add the images you want to fix.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border-[#05DAED]/40 border flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <MousePointerClick className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Adjust')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the rotate and flip buttons.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
              <Download className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Save')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download the corrected images.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
