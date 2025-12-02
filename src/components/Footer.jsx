import React from 'react';
import { FileText } from 'lucide-react';

export const Footer = () => (
  <footer className="py-8 border-t border-white/10 text-center">
    <p className="text-gray-500 text-sm mb-4">© 2025 Vijay Chaudhari. Built with React & Tailwind.</p>
    
    {/* Download Resume Button*/}
    <a 
      href="https://docs.google.com/document/d/1ov38Uvo9F2eD6naFYR5x4p3L4jn-CGrZhH6_JWV0V1o/export?format=pdf"
      className="inline-flex items-center gap-2 text-neon-green border border-neon-green/30 px-4 py-2 rounded-full hover:bg-neon-green/10 transition-colors text-sm font-medium"
    >
      <FileText size={16} /> Download Resume
    </a>
  </footer>
);