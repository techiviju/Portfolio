import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { ExternalLink, Github, X } from "lucide-react";
// PROJECTS is imported from your data file
import { PROJECTS } from "../data.js";

export const Projects = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId);

  return (
    <section id="projects" className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Projects Summary
        </h2>
        {/* The grid layout now supports different screen sizes */}
        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              className="glass p-6 md:p-8 rounded-2xl cursor-pointer group hover:border-neon-blue/50 transition-colors flex flex-col h-full"
              onClick={() => setSelectedId(project.id)}
              whileHover={{ y: -5 }}
            >
              {/* This div grows to push the tech stack to the bottom */}
             
              <div className="grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
                    {project.title}
                  </h3>
                  <ExternalLink
                    // Replaced 'flex-shrink-0' with 'shrink-0'
                    className="text-gray-500 group-hover:text-white shrink-0 ml-2"
                    size={20}
                  />
                </div>
                <p className="text-gray-400 mb-6">{project.tagline}</p>
              </div>

              {/* This div shrinks and stays at the bottom */}
              {/* Replaced 'flex-shrink-0' with 'shrink-0' */}
              <div className="shrink-0">
                <div className="flex gap-2 flex-wrap">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-xs px-2 py-1 text-gray-500">
                      +{project.tech.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && selectedProject && (
            <Dialog
              static
              as={motion.div}
              open={true}
              onClose={() => setSelectedId(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
              />

              {/* Modal Content */}
              <motion.div
                layoutId={`card-${selectedId}`}
                // Added flex, flex-col, max-h-[90vh] and overflow-hidden
                // This constrains the modal height and allows internal scrolling
                className="glass w-full max-w-2xl rounded-2xl relative z-10 bg-[#111] flex flex-col max-h-[90vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {/* Modal Header (Fixed) */}
                {/* Replaced 'flex-shrink-0' with 'shrink-0' */}
                <div className="p-6 md:p-8 shrink-0 relative">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                  >
                    <X size={24} />
                  </button>
                  {/* Responsive text size and padding-right to avoid close button */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 pr-8">
                    {selectedProject.title}
                  </h3>
                  <p className="text-neon-green">{selectedProject.tagline}</p>
                </div>

                {/* Modal Body (Scrollable) */}
                {/* Added overflow-y-auto to make this section scrollable */}
                <div className="overflow-y-auto px-6 md:px-8 pb-6 md:pb-8">
                  <div className="mb-6 md:mb-8">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                      About
                    </h4>
                    {/* This paragraph can now be very long without breaking the layout */}
                    <p className="text-gray-300 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer (Fixed) */}
                {/* Replaced 'flex-shrink-0' with 'shrink-0' */}
                <div className="shrink-0 p-6 md:p-8 pt-4 border-t border-gray-800">
                  {/* Buttons stack on small screens */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-neon-blue text-black py-2 rounded-lg font-bold hover:bg-opacity-90 text-center"
                    >
                      <ExternalLink size={18} /> Live Demo
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 py-2 rounded-lg hover:bg-white/10 text-center"
                    >
                      <Github size={18} /> Source Code
                    </a>
                  </div>
                </div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
