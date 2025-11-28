import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserCircle } from 'lucide-react'; // Import UserCircle
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import { useAuth } from '../contexts/AuthContext'; // Import auth hook

// Navbar now accepts props from the parent (PublicPortfolio)
export const Navbar = ({ name, resumeLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Get auth state

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    { title: 'About', href: '#about' },
    { title: 'Skills', href: '#skills' },
    { title: 'Projects', href: '#projects' },
    { title: 'Contact', href: '#contact' },
  ];
  
  // Use the name prop for the logo
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');

  // ... (mobileMenuVariants, linkContainerVariants, linkVariants remain the same)
  const mobileMenuVariants = {
    open: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
    closed: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };
  const linkContainerVariants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };
  const linkVariants = {
    open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 glass py-3 bg-dark-bg/80`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo section - now dynamic */}
          <a href="#" className="text-2xl font-bold text-white leading-none shrink-0 z-50">
            {firstName}<span className="text-neon-green"> {lastName}</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Desktop Buttons Wrapper */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Resume Button - now uses dynamic link */}
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-neon-green text-neon-green rounded-md hover:bg-neon-green/10 transition-all text-sm font-semibold"
            >
              Resume
            </a>

            {/* --- NEW PROFILE ICON --- */}
            {/* This is the new icon you requested. */}
            {/* It uses React Router's Link to navigate. */}
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth/login"}
              className="text-gray-400 hover:text-neon-green transition-colors"
              title={isAuthenticated ? "Go to Dashboard" : "Login / Sign Up"}
            >
              <UserCircle size={28} />
            </Link>
            {/* If you absolutely want the Mantine Avatar, you would:
              1. `npm install @mantine/core @mantine/hooks`
              2. Wrap your `App.jsx` in `<MantineProvider>`
              3. Use this code instead of the <Link> above:
              
              <Link to={isAuthenticated ? "/dashboard" : "/auth/login"}>
                <Avatar 
                  src={isAuthenticated ? auth.user.avatarUrl : null} // Use user's avatar if logged in
                  alt={isAuthenticated ? auth.user.name : "Profile"}
                  radius="xl"
                  size="sm"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {!isAuthenticated && <UserCircle size={20} />} 
                </Avatar>
              </Link>
              
              For now, the Lucide UserCircle icon is cleaner as it uses our existing library.
            */}
          </div>

          {/* Mobile Burger Button */}
          <div className="md:hidden z-50 flex items-center space-x-2">
            {/* --- NEW PROFILE ICON (MOBILE) --- */}
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth/login"}
              className="text-gray-400 hover:text-neon-green transition-colors"
              title={isAuthenticated ? "Go to Dashboard" : "Login / Sign Up"}
            >
              <UserCircle size={26} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 w-full h-screen bg-dark-bg z-40"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
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
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </motion.a>
              ))}
              {/* Mobile Resume Button - now uses dynamic link */}
              <motion.a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-neon-green text-neon-green rounded-md hover:bg-neon-green/10 transition-all text-xl font-semibold"
                variants={linkVariants}
                onClick={() => setIsOpen(false)}
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