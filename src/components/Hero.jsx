import React from 'react';
import { motion } from 'framer-motion';
// Import the new data object
import { PERSONAL_DETAILS } from '../data';

export const Hero = () => (
  <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20">
    {/* Background Glows */}
    <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-neon-blue/20 rounded-full blur-[80px] sm:blur-[100px]" />
    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-neon-green/10 rounded-full blur-[80px] sm:blur-[100px]" />

    <div className="container px-4 sm:px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-green text-xs sm:text-sm mb-6">
          {PERSONAL_DETAILS.hero.status}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
          {PERSONAL_DETAILS.hero.titleLine1} <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-green to-neon-blue">{PERSONAL_DETAILS.hero.titleHighlight}</span> <br />
          {PERSONAL_DETAILS.hero.titleSuffix}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-10">
          Hi, I'm <span className="text-white font-semibold">{PERSONAL_DETAILS.name}</span>. {PERSONAL_DETAILS.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#projects" className="px-8 py-3 bg-linear-to-r from-neon-blue to-neon-green text-black font-bold rounded-lg hover:shadow-neon transition-all w-full sm:w-auto">
            {PERSONAL_DETAILS.hero.btnPrimary}
          </a>
          <a href="#contact" className="px-8 py-3 glass text-white rounded-lg hover:bg-white/10 transition-all w-full sm:w-auto">
            {PERSONAL_DETAILS.hero.btnSecondary}
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);