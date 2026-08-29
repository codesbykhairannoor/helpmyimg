import { FileBadge, Globe2, FileText, CheckCircle2, ClipboardList, ScanFace } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function ResizePassportSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'resizepassport' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'resizepassport' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-16 py-12">
      
      {/* SECTION 1: Document Style Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileBadge className="w-10 h-10" />
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          {config.extraSectionTitle || config.h1}
        </h2>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
           <p className="font-body text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
             {config.extraSectionDesc || config.description}
           </p>
        </div>
      </section>

      {/* SECTION 2: Standard List */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white inline-flex items-center gap-3">
              <Globe2 className="w-6 h-6 text-blue-500" />
              {config.extraSectionTitle}
            </h3>
            <p className="font-body mt-2 text-slate-500">{config.extraSectionDesc}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {(config.extraSectionItems || [])?.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-white dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl p-6 border-t-4 border-blue-500 shadow-sm">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 text-blue-500"><CheckCircle2 className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-1">
                       {item.split(':')[0]}
                    </h4>
                    <p className="font-body text-slate-600 dark:text-slate-400 text-sm">
                       {item.split(':')[1]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Checklist */}
      {config.extraSection2Title && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-10">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-8 shadow-sm">
             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-2xl text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                <ClipboardList className="w-8 h-8" />
             </div>
             <div>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">{config.extraSection2Title}</h3>
                <p className="font-body text-slate-600 dark:text-slate-400 mb-6">{config.extraSection2Desc}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {(config.extraSection2Items || [])?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                       <ScanFace className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                       <p className="font-body text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Clean Document FAQs */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12">
           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
              <FileText className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Help & Guidelines</h3>
           </div>
           
           <div className="space-y-8">
              {config.faqs?.map((faq, i) => (
                <div key={i}>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h4>
                  <p className="font-body text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
