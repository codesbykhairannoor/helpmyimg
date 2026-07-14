// src/components/Hero.tsx
// Bagian Hero Banner dengan Animasi Framer Motion dan Statistik Pembuktian Kuantitatif (GEO)

import { motion } from 'framer-motion';

interface HeroProps {
  title?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {

  return (
    <section className="relative pt-8 pb-6 md:pt-12 md:pb-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-neon-cyan/20 via-neon-indigo/20 to-neon-violet/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
        >
          {title || "Every AI tool you need to edit images in bulk"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {description || "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser."}
        </motion.p>

      </div>
    </section>
  );
};
