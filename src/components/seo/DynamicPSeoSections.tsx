// src/components/seo/DynamicPSeoSections.tsx
import React, { useState, useRef } from 'react';
import { ChevronDown, MessageCircleQuestion, Shield, Zap, Target, Image as ImageIcon } from 'lucide-react';
import type { PSeoJsonData, PSeoSectionData } from '../../hooks/usePSeoData';

// --- Building Block Sections ---

const HeroSplitVariant: React.FC<{ section: PSeoSectionData, flip: boolean }> = ({ section, flip }) => (
  <section className="max-w-7xl mx-auto w-full relative py-16 px-6">
    <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          {section.badgeText}
        </div>
        <h2 
          className="font-heading font-extrabold text-white leading-tight mt-4 sm:mt-6 tracking-tight"
          style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
        >
          {section.title}
        </h2>
        <p 
          className="text-slate-400 mt-4 max-w-2xl font-body"
          style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
        >
          {section.content}
        </p>
      </div>
      <div className="flex-1 w-full bg-dark-800 rounded-[2rem] p-8 border border-dark-600/50 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[300px]">
         <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent pointer-events-none" />
         <ImageIcon className="w-32 h-32 text-dark-600" />
      </div>
    </div>
  </section>
);

const HeroCenterVariant: React.FC<{ section: PSeoSectionData }> = ({ section }) => (
  <section className="max-w-4xl mx-auto w-full relative py-20 px-6 text-center">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 text-neon-indigo text-xs font-bold uppercase tracking-wider mb-8">
      <Target className="w-4 h-4" />
      {section.badgeText}
    </div>
    <h2 
      className="font-heading font-extrabold text-white leading-tight mt-4 sm:mt-6 tracking-tight mb-6"
      style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
    >
      {section.title}
    </h2>
    <p 
      className="text-slate-400 mt-4 max-w-2xl mx-auto font-body"
      style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
    >
      {section.content}
    </p>
  </section>
);

const PrivacyShieldVariant: React.FC<{ section: PSeoSectionData, isDark: boolean }> = ({ section, isDark }) => (
  <section className={`w-full py-20 px-6 ${isDark ? 'bg-dark-900 border-t border-b border-dark-700' : 'bg-dark-800'}`}>
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
      <div className="w-24 h-24 shrink-0 rounded-full bg-neon-emerald/20 flex items-center justify-center text-neon-emerald">
        <Shield className="w-12 h-12" />
      </div>
      <div>
        <h3 
          className="font-heading font-bold text-white mb-4"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
        >
          {section.title}
        </h3>
        <p 
          className="text-slate-400 font-body"
          style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
        >
          {section.content}
        </p>
      </div>
    </div>
  </section>
);

const HowToStepsVariant: React.FC<{ section: PSeoSectionData }> = ({ section }) => {
  const steps = section.content.split('\n').filter(Boolean);
  return (
    <section className="max-w-6xl mx-auto w-full py-20 px-6">
      <div className="text-center mb-16">
        <h2 
          className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
        >
          {section.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="bg-dark-800 p-8 rounded-3xl border border-dark-600 relative">
             <div className="absolute -top-5 left-8 w-10 h-10 bg-neon-cyan text-dark-900 font-bold flex items-center justify-center rounded-full text-lg">
                {i + 1}
             </div>
             <p 
               className="mt-4 text-slate-300 font-body"
               style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}
             >
               {step.replace(/^\d+\.\s*/, '')}
             </p>
          </div>
        ))}
      </div>
    </section>
  );
};


// --- FAQ Accordion ---
const AccordionFaqItem: React.FC<{ faq: { q: string, a: string }, isOpen: boolean, onToggle: () => void }> = ({ faq, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="glass-panel mb-4 rounded-[24px] overflow-hidden transition-all duration-300" style={{ border: isOpen ? '1px solid var(--color-neon-cyan)' : '1px solid var(--color-dark-600)', background: isOpen ? 'var(--color-dark-800)' : 'var(--color-dark-900)' }}>
      <button onClick={onToggle} className="w-full px-8 py-6 flex items-center justify-between text-left border-none bg-transparent cursor-pointer text-white">
        <span className="text-lg font-bold pr-6">{faq.q}</span>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-transform duration-300 ${isOpen ? 'bg-neon-cyan text-dark-900 rotate-180' : 'bg-dark-700 text-slate-400'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div style={{ height: isOpen ? (contentRef.current?.scrollHeight || 'auto') : 0, opacity: isOpen ? 1 : 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <div ref={contentRef} className="px-8 pb-8 text-slate-400 text-base leading-relaxed">
          {faq.a}
        </div>
      </div>
    </div>
  );
};

// --- Main Orchestrator ---

interface DynamicPSeoSectionsProps {
  data: PSeoJsonData;
}

export const DynamicPSeoSections: React.FC<DynamicPSeoSectionsProps> = ({ data }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!data) return null;

  return (
    <article className="w-full flex flex-col bg-dark-900 text-slate-100">
      {/* Sections rendering based on JSON layout array */}
      {data.sections.map((section, index) => {
        const type = section.type;
        const flip = index % 2 !== 0;

        if (type.includes('hero_split')) return <HeroSplitVariant key={index} section={section} flip={type === 'hero_split_reverse' ? !flip : flip} />;
        if (type.includes('hero_center')) return <HeroCenterVariant key={index} section={section} />;
        if (type.includes('privacy')) return <PrivacyShieldVariant key={index} section={section} isDark={type.includes('dark')} />;
        if (type.includes('how_to')) return <HowToStepsVariant key={index} section={section} />;

        // Fallback
        return <HeroSplitVariant key={index} section={section} flip={flip} />;
      })}

      {/* FAQ & Schema */}
      {data.faqs?.length > 0 && (
        <section className="max-w-4xl mx-auto w-full py-24 px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 rounded-full font-bold text-sm mb-6">
              <MessageCircleQuestion size={18} /> {data.supportCenter}
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white mb-4">
              {data.faqTitle}
            </h2>
          </div>
          <div className="flex flex-col">
            {data.faqs.map((faq, i) => (
              <AccordionFaqItem key={i} faq={faq} isOpen={activeFaq === i} onToggle={() => setActiveFaq(activeFaq === i ? null : i)} />
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: data.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
          })}} />
        </section>
      )}
    </article>
  );
};
