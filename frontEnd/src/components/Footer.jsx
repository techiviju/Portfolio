import React from 'react';
import { FileText } from 'lucide-react';

// Footer component now accepts props
export const Footer = ({ name, resumeDownloadLink }) => (
  <footer className="py-8 border-t border-white/10 text-center">
    {/* Dynamic name */}
    <p className="text-gray-500 text-sm mb-4">© 2025 Vijay Chaudhari. Built with React & Tailwind.</p>
    
    {/* Dynamic resume download link */}
    <a
      href={resumeDownloadLink}
      className="inline-flex items-center gap-2 text-neon-green border border-neon-green/30 px-4 py-2 rounded-full hover:bg-neon-green/10 transition-colors text-sm font-medium"
    >
      <FileText size={16} /> Download Resume
    </a>
  </footer>
);