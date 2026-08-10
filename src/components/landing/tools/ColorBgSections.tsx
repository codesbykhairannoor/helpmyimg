import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Palette, Wand2, Image as ImageIcon, Focus, Monitor, LayoutGrid, Droplet, Download, Lock } from 'lucide-react';

export const ColorBgSections: React.FC = () => {
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s1Title', 'Upload Image')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Ensure your image has a transparent background first.')}</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

            <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
              <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
                <Palette className="w-8 h-8 text-[#05DAED]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s2Title', 'Pick a Color')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the color picker or enter your custom HEX code.')}</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

            <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
              <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
                <Download className="w-8 h-8 text-[#12DA91]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s3Title', 'Export')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download your newly colored image in full resolution.')}</p>
            </div>
          </div>
        </div>
      </section>

    
          </div>
  );
};
