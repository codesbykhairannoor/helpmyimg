import { ShoppingBag, Star, LayoutTemplate, BadgeCheck, Zap, ArrowRightCircle } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';
import { useTranslation } from '../../../context/LanguageContext';

export function ColorWhiteSections() {
  const { t } = useTranslation();
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'colorwhite' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'colorwhite' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-24 py-16">
      
      {/* SECTION 1: Product Showcase Slider */}
      <section className="relative w-full overflow-hidden py-10">
        <div className="text-center mb-16 px-4">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {config.extraSectionTitle || "Amazon Ready"}
          </h2>
          <p className="font-body mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {config.extraSectionDesc || config.description}
          </p>
        </div>

        {/* E-commerce mockups */}
        <div className="max-w-[1500px] mx-auto w-full">
          <div className="flex gap-6 px-4 md:px-12 overflow-x-auto pb-8 snap-x">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-[280px] md:w-[320px] snap-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none dark:border dark:border-slate-800 p-4">
              <div className="aspect-square bg-slate-100 rounded-xl mb-4 relative overflow-hidden group">
                 {/* Before State (Hover to reveal after) */}
                 <div className="absolute inset-0 bg-slate-300 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">{config.beforeImageLabel}</span>
                 </div>
                 {/* After State */}
                 <div className="absolute inset-0 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 border-orange-500 rounded-xl">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs shadow-lg">{config.afterImageLabel}</span>
                 </div>
              </div>
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 w-1/3 bg-orange-100 dark:bg-orange-900/30 rounded"></div>
                <div className="flex gap-1 text-orange-400"><Star className="w-4 h-4 fill-current"/> <Star className="w-4 h-4 fill-current"/> <Star className="w-4 h-4 fill-current"/></div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: E-Commerce Benefits */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/40 dark:shadow-none dark:border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-bold mb-4">
                <ShoppingBag className="w-4 h-4" /> E-Commerce Optimization
              </span>
              <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">{config.extraSectionTitle}</h2>
              <p className="font-body mt-3 text-slate-600 dark:text-slate-400">{config.extraSectionDesc}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {(config.extraSectionItems || [])?.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 text-orange-500">
                    {idx === 0 ? <BadgeCheck /> : idx === 1 ? <LayoutTemplate /> : <Zap />}
                  </div>
                  <p className="font-body font-semibold text-slate-800 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Why Pure White Matters */}
      {config.extraSection2Title && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full mb-12 text-center">
          <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSection2Title}</h3>
          <p className="font-body text-slate-600 dark:text-slate-400 mb-8">{config.extraSection2Desc}</p>
          <div className="flex flex-col gap-4">
            {(config.extraSection2Items || [])?.map((item, idx) => (
               <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                 <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                 <ArrowRightCircle className="w-5 h-5 text-orange-500" />
               </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: Clean FAQs */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full mb-16">
        <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t('longtail.faq', { defaultValue: 'Frequently Asked Questions' })}</h3>
        <div className="space-y-4">
          {config.faqs?.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
              <p className="font-body text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
