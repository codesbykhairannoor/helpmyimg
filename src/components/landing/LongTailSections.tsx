import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../data/pseoKeywords';
import { useTranslation } from '../../context/LanguageContext';

interface LongTailSectionsProps {
  tool: string;
}

export const LongTailSections: React.FC<LongTailSectionsProps> = ({ tool }) => {
  const { t, lang } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Fetch Matrix data for FAQs
  const matrixItem = PSEO_KEYWORD_MATRIX.find(
    (m) => m.tool === tool && (m.lang === lang || m.lang === (lang === 'zh-CN' ? 'zh' : lang))
  );

  // Parse Features from translations
  const features = [];
  for (let i = 1; i <= 4; i++) {
    const featTitle = t(`longtail.${tool.toLowerCase()}.feat${i}.title`);
    const featDesc = t(`longtail.${tool.toLowerCase()}.feat${i}.desc`);
    if (featTitle && featTitle !== `longtail.${tool.toLowerCase()}.feat${i}.title`) {
      features.push({ title: featTitle, desc: featDesc });
    }
  }

  return (
    <div className="w-full">
      {/* Features Section */}
      {features.length > 0 && (
        <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 inline-block">
              {t('longtail.features', { defaultValue: 'Core Features' })}
            </span>
            <h2 
              className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
              style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              {t(`longtail.${tool.toLowerCase()}.feat.h2`, { defaultValue: 'Why choose our tool?' })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-dark-600/50 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(5,218,237,0.15)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-dark-800/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-dark-600/50">
                  <CheckCircle className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-slate-400 font-body leading-relaxed text-sm sm:text-base">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {matrixItem && matrixItem.faqs && matrixItem.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto w-full relative" style={{ padding: '0px 24px', marginBottom: '120px' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(18,218,145,0.1)_0%,transparent_70%)] pointer-events-none -z-10" />
          
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 inline-block">
              {t('longtail.faq', { defaultValue: 'FAQ' })}
            </span>
            <h2 
              className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
              style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              {t('landing.global.faq.title', { defaultValue: 'Frequently Asked Questions' })}
            </h2>
          </div>

          <div className="space-y-4 relative z-10">
            {matrixItem.faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel rounded-2xl border border-dark-600/50 overflow-hidden transition-all duration-300 hover:border-[#12DA91]/30">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between bg-dark-800/40 hover:bg-dark-700/50 transition-colors text-left"
                >
                  <h3 className="text-base sm:text-lg font-bold text-white pr-4 sm:pr-8">{faq.question}</h3>
                  {openIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#12DA91] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-4 sm:px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-96 py-4 sm:py-5 border-t border-dark-600/30' : 'max-h-0'}`}
                >
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
