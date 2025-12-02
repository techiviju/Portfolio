import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// We need to import the icons for the burger menu
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  // 1. State to manage the mobile menu (open/closed)
  const [isOpen, setIsOpen] = useState(false);

  // We no longer need 'isScrolled' state
  // const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Removed the scroll handling logic

    // Good practice to disable body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      // Removed scroll event listener cleanup
      document.body.style.overflow = 'auto'; // Ensure scroll is re-enabled
    };
  }, [isOpen]); // Rerun effect only if isOpen changes

  // Switched to an array of objects for cleaner mapping
  const navLinks = [
    { title: 'About', href: '#about' },
    { title: 'Skills', href: '#skills' },
    { title: 'Projects', href: '#projects' },
    { title: 'Contact', href: '#contact' },
  ];

  const resumeLink = "https://docs.google.com/document/d/1ov38Uvo9F2eD6naFYR5x4p3L4jn-CGrZhH6_JWV0V1o/edit?usp=sharing";

  // Animation variants for the mobile menu container
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };
  
  // Animation variants for the links inside the menu
  const linkContainerVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const linkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };


  return (
    // Use a React Fragment to return two sibling elements:
    // The <nav> and the mobile <div>
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 glass py-3 bg-dark-bg/80`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        {/* Use a consistent padding for mobile and desktop */}
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* logo section */}
          <a href="#" className="text-2xl font-bold text-white leading-none shrink-0 z-50">
            Vijay<span className="text-neon-green"> Chaudhari</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((item) => (
              <a 
                key={item.title} 
                href={item.href} 
                className="text-gray-300 hover:text-neon-blue transition-colors text-sm font-medium tracking-wide"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Desktop Resume Button */}
          {/* This is now HIDDEN on mobile, and a block element on medium+ */}
          <a 
            href={resumeLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block px-4 py-2 border border-neon-green text-neon-green rounded-md hover:bg-neon-green/10 transition-all text-sm font-semibold"
          >
            Resume
          </a>

          {/* 2. Mobile Burger Button */}
          {/* This button is ONLY visible on mobile (md:hidden) */}
          <div className="md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {/* Switch between Menu and X icons */}
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>

        </div>
      </motion.nav>

      {/* 3. Full-Screen Mobile Menu */}
      {/* This animates using AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 w-full h-screen bg-dark-bg z-40"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* We center the links and add padding-top to clear the navbar */}
            <motion.div 
              className="flex flex-col items-center justify-center h-full space-y-8"
              variants={linkContainerVariants}
            >
              {navLinks.map((item) => (
                <motion.a 
                  key={item.title} 
                  href={item.href} 
                  className="text-gray-300 hover:text-neon-blue transition-colors text-3xl font-medium"
                  variants={linkVariants}
                  onClick={() => setIsOpen(false)} // Close menu on link click
                >
                  {item.title}
                </motion.a>
              ))}
              {/* Mobile Resume Button */}
              <motion.a 
                href={resumeLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border border-neon-green text-neon-green rounded-md hover:bg-neon-green/10 transition-all text-xl font-semibold"
                variants={linkVariants}
                onClick={() => setIsOpen(false)} // Close menu on link click
              >
                Resume
             </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};