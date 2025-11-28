import React from 'react';
import { motion } from 'framer-motion';

export const Hero = ({ name, heroData }) => (
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
        
        {/* Availability Badge */}
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-green text-xs sm:text-sm mb-6 backdrop-blur-sm">
          {heroData.availabilityText || 'Available for Immediate Joining'}
        </span>

        {/* Main Heading 
            Note: I added `[&_span]:...` classes. 
            This means ANY <span> coming from your backend inside these lines 
            will automatically get the Neon Gradient effect!
        */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight 
                       [&_span]:text-transparent [&_span]:bg-clip-text [&_span]:bg-gradient-to-r [&_span]:from-neon-green [&_span]:to-neon-blue">
          
          <span dangerouslySetInnerHTML={{ __html: heroData.titleLine1 }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: heroData.titleLine2 }} />
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
          Hi, I'm <span className="text-white font-semibold">{name}</span>. {heroData.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#projects" 
            className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all w-full sm:w-auto transform hover:-translate-y-1"
          >
            View Work
          </a>
          <a 
            href="#contact" 
            className="px-8 py-3 glass text-white rounded-lg hover:bg-white/10 border border-white/10 transition-all w-full sm:w-auto hover:border-neon-blue/30"
          >
            Contact Me
          </a>
        </div>

      </motion.div>
    </div>
  </section>
);