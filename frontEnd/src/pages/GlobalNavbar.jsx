import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, Layout, Shield, Zap, LogOut, Menu, X, LogIn, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalNavbar = () => {
  const {isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 1. Hide ONLY on public portfolio pages
  if (location.pathname.startsWith('/u/')) {
    return null;
  }

  // 2. Role Logic
  const roles = user?.roles || [];
  const checkRole = (roleToFind) => {
    return roles.some(r => {
      const roleName = typeof r === 'string' ? r : r.authority || r.name;
      return roleName === roleToFind;
    });
  };

  const isAdmin = checkRole('ROLE_ADMIN') || checkRole('ROLE_SUPER_ADMIN');
  const isSuperAdmin = checkRole('ROLE_SUPER_ADMIN');

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, visible: true },
    { name: 'Dashboard', path: '/dashboard', icon: Layout, visible: !!user },
    { name: 'Admin Panel', path: '/admin', icon: Shield, visible: isAdmin },
    { name: 'Super Control', path: '/super-admin', icon: Zap, visible: isSuperAdmin },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setShowLogoutConfirm(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* FIX: Used z-100 (canonical) to sit on top of everything */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 w-full z-100 transition-all duration-300 glass py-3 bg-dark-bg/90 backdrop-blur-lg border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-neon-blue to-neon-green flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-neon-blue/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Portfolio
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(l => l.visible).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'text-neon-blue' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            ))}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neon-green border border-white/10">
                    <User size={16} />
                  </div>
                  <span className="text-xs font-bold hidden lg:block">{user.username}</span>
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth/login"
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-all border border-white/10 flex items-center gap-2"
              >
                <LogIn size={16} /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            // FIX: Used z-90 (canonical)
            className="md:hidden fixed top-16 left-0 w-full bg-dark-bg/95 backdrop-blur-xl border-b border-white/10 z-90 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.filter(l => l.visible).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-neon-blue/10 text-neon-blue' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-white/10 my-4 pt-4">
                {user ? (
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={20} /> Logout ({user.username})
                  </button>
                ) : (
                  <Link 
                    to="/auth/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10"
                  >
                    <LogIn size={20} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          // FIX: Used z-200 (canonical)
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass max-w-sm w-full p-6 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
                  <LogOut size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to leave?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  You are about to sign out of your account.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-bold shadow-lg shadow-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalNavbar;