import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { TIMELINE, PERSONAL_DETAILS } from '../data';

export const About = () => (
  <section id="about" className="py-20 bg-black/20">
    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Terminal className="text-neon-blue" /> {PERSONAL_DETAILS.about.heading}
        </h2>
        
        {/* Allows bold tags <b> to work from data.js */}
        <p 
          className="text-gray-400 mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: PERSONAL_DETAILS.about.bio }} 
        />
        
        <div className="flex gap-4">
          <div className="glass p-4 rounded-lg text-center flex-1">
            <h3 className="text-2xl font-bold text-neon-green">{PERSONAL_DETAILS.about.stats.expValue}</h3>
            <p className="text-xs text-gray-400">{PERSONAL_DETAILS.about.stats.expLabel}</p>
          </div>
          <div className="glass p-4 rounded-lg text-center flex-1">
            <h3 className="text-2xl font-bold text-neon-blue">{PERSONAL_DETAILS.about.stats.projValue}</h3>
            <p className="text-xs text-gray-400">{PERSONAL_DETAILS.about.stats.projLabel}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="relative border-l border-gray-800 ml-4 md:ml-0"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {TIMELINE.map((item, index) => (
          <div key={index} className="mb-10 ml-6 relative group">
            <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-dark-bg border border-neon-blue group-hover:bg-neon-blue/20 transition-colors">
              <div className="h-2 w-2 rounded-full bg-neon-blue" />
            </span>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <span className="text-sm text-neon-green mb-2 block">{item.year} | {item.subtitle}</span>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);