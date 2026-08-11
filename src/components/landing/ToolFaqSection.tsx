import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface ToolFaqSectionProps {
  toolMapName: string;
  variant?: 'grid' | 'accordion' | 'cards' | 'split';
}

export const ToolFaqSection: React.FC<ToolFaqSectionProps> = ({ toolMapName, variant = 'grid' }) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const tag = t('landing.global.faq.tag', { defaultValue: 'HELP CENTER & FAQ' });
  const title = t('landing.global.faq.title', { defaultValue: 'Frequently Asked Questions' });
  const desc = t('landing.global.faq.desc', { defaultValue: 'Everything you need to know about our local processing engine.' });

  const faqs: FaqItem[] = [1, 2, 3, 4]
    .map((num) => {
      const qKey = `landing.${toolMapName}.faq${num}.q`;
      const aKey = `landing.${toolMapName}.faq${num}.a`;
      const q = t(qKey);
      const a = t(aKey);
      if (q === qKey) return null;
      return { q, a };
    })
    .filter((f): f is FaqItem => f !== null);

  if (faqs.length === 0) return null;

  if (variant === 'accordion') {
    return (
      <section className="max-w-4xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.1)_0%,transparent_70%)] pointer-events-none -z-10" />
        
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 inline-block">
            {tag}
          </span>
          <h2 
            className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
            style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
          >
            {title}
          </h2>
          <p 
            className="text-slate-400 mt-4 max-w-2xl mx-auto font-body"
            style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
          >
            {desc}
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-dark-600/50 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between bg-dark-800/40 hover:bg-dark-700/50 transition-colors text-left"
              >
                <h3 className="text-base sm:text-lg font-bold text-white pr-4 sm:pr-8">{faq.q}</h3>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-neon-cyan shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              <div 
                className={`px-4 sm:px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-96 py-4 sm:py-5 border-t border-dark-600/30' : 'max-h-0'}`}
              >
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32 mb-8 lg:mb-0">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-violet bg-neon-violet/10 px-3 py-1.5 rounded-full border border-neon-violet/30 inline-block">
              {tag}
            </span>
            <h2 
              className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
              style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              {title}
            </h2>
            <p 
              className="text-slate-400 mt-4 max-w-xl font-body"
              style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
            >
              {desc}
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-dark-600/30 shadow-xl hover:border-neon-violet/40 transition-colors group">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-neon-violet shrink-0 sm:mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-neon-violet transition-colors">{faq.q}</h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
    return (
      <section className="max-w-6xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 inline-block">
            {tag}
          </span>
          <h2 
            className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
            style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
          >
            {title}
          </h2>
          <p 
            className="text-slate-400 mt-4 max-w-2xl mx-auto font-body"
            style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
          >
            {desc}
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-dark-800/60 p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border-l-4 border-l-neon-cyan border-y border-y-dark-600/30 border-r border-r-dark-600/30 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{faq.q}</h3>
              <p className="text-slate-400 text-sm sm:text-lg leading-relaxed font-body max-w-4xl">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Default variant === 'grid'
  return (
    <section className="max-w-5xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.1)_0%,transparent_70%)] pointer-events-none -z-10" />
      
      <div className="text-center mb-10 sm:mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 inline-block">
          {tag}
        </span>
        <h2 
          className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight"
          style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
        >
          {title}
        </h2>
        <p 
          className="text-slate-400 mt-4 max-w-2xl mx-auto font-body"
          style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
        >
          {desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-dark-600/50 hover:border-neon-cyan/40 hover:bg-dark-800/80 transition-all duration-300 group hover:shadow-[0_10px_30px_-15px_rgba(34,211,238,0.2)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-neon-cyan mb-4 sm:mb-6 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 leading-snug group-hover:text-neon-cyan transition-colors">
                {faq.q}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-body">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

