import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Award } from 'lucide-react';

export const LandingStats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: Zap, iconColor: 'text-neon-cyan', glowBase: 'bg-neon-cyan/10', glowHover: 'group-hover:bg-neon-cyan/20', key: 'time' },
            { icon: Award, iconColor: 'text-neon-emerald', glowBase: 'bg-neon-emerald/10', glowHover: 'group-hover:bg-neon-emerald/20', key: 'prec' },
            { icon: Shield, iconColor: 'text-neon-indigo', glowBase: 'bg-neon-indigo/10', glowHover: 'group-hover:bg-neon-indigo/20', key: 'priv' },
            { icon: Cpu, iconColor: 'text-neon-pink', glowBase: 'bg-neon-pink/10', glowHover: 'group-hover:bg-neon-pink/20', key: 'batch' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const rawVal = t(`stat.${stat.key}.val`) || '';
            const cleanVal = rawVal.replace(/^[^a-zA-Z0-9\p{L}\p{N}]+\s*/u, '').trim();
            const label = t(`stat.${stat.key}.label`);

            return (
              <div key={idx} className="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-dark-500/40 text-left">
                {/* Subtle Hover Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.glowBase} ${stat.glowHover} rounded-full blur-2xl -mr-8 -mt-8 transition-all duration-300 pointer-events-none`} />
                
                <div className="w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-600/50 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className={`w-5 h-5 ${stat.iconColor} stroke-[2.5]`} />
                </div>
                
                <div className="text-xl font-heading font-extrabold text-slate-100 group-hover:text-white transition-colors mb-1">
                  {cleanVal}
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
