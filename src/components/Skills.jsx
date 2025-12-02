import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../data';

export const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Technical Arsenal</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(SKILLS).map(([category, data], idx) => {
            const Icon = data.icon;
            return (
              <motion.div 
                key={category}
                className="glass p-8 rounded-2xl relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon size={100} />
                </div>
                <h3 className="text-xl font-bold text-neon-blue mb-6 flex items-center gap-2">
                  <Icon size={20} /> {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.items.map((skill) => (
                    <div key={skill.name} className="group/tag relative">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-neon-green hover:text-neon-green transition-colors cursor-default">
                        {skill.name}
                      </span>
                      {/* Simple Tooltip */}
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-neon-green text-black text-xs rounded opacity-0 group-hover/tag:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};