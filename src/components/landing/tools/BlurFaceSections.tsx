import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { ScanFace, EyeOff, Shield, Crop, UserX, Download, Upload } from 'lucide-react';

export const BlurFaceSections: React.FC = () => {
  const { t } = useTranslation();
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#10B981]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s1Title', 'Upload')}</h3>
            <p className="text-lg text-slate-400">{tr('s1Desc', 'Drop photos safely into the browser.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#06B6D4]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ScanFace className="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s2Title', 'Detect')}</h3>
            <p className="text-lg text-slate-400">{tr('s2Desc', 'Let AI find and select faces automatically.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#10B981]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Download className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s3Title', 'Save')}</h3>
            <p className="text-lg text-slate-400">{tr('s3Desc', 'Download the anonymized photos.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
