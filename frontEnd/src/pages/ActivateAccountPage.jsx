import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Eye, EyeOff, Loader2, CheckCircle, AlertTriangle, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: '', success: false });

    // 1. Validation
    if (formData.password !== formData.confirmPassword) {
      setStatus({ loading: false, error: "Passwords do not match.", success: false });
      return;
    }
    if (formData.password.length < 6) {
      setStatus({ loading: false, error: "Password must be at least 6 characters.", success: false });
      return;
    }

    // 2. API Call
    setStatus({ loading: true, error: '', success: false });
    try {
      // POST /api/auth/activate
      await api.post('/auth/activate', {
        token: token,
        password: formData.password
      });
      
      setStatus({ loading: false, error: '', success: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Activation failed. Link might be expired.";
      setStatus({ loading: false, error: msg, success: false });
    }
  };

  // --- RENDER: MISSING TOKEN ---
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-4">
        <div className="glass p-8 rounded-lg w-full max-w-md text-center border border-red-500/30">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
          <p className="text-gray-400 mb-6">This activation link is invalid or missing.</p>
          <Link to="/" className="text-neon-blue hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // --- RENDER: SUCCESS STATE ---
  if (status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 rounded-2xl w-full max-w-md text-center border border-neon-green/30 shadow-[0_0_40px_rgba(0,255,163,0.1)]"
        >
          <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-neon-green">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">Account Activated!</h2>
          <p className="text-gray-400 mb-8">
            Your password has been set securely. You can now access your dashboard.
          </p>
          <Link 
            to="/auth/login" 
            className="block w-full bg-neon-green text-black font-bold py-3.5 rounded-xl hover:bg-[#00cc82] transition-all shadow-lg shadow-neon-green/20"
          >
            Login Now
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- RENDER: FORM STATE ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-neon-blue" />
          </div>
          <h2 className="text-3xl font-bold">Set Password</h2>
          <p className="text-gray-400 text-sm mt-2">Create a secure password to activate your account.</p>
        </div>

        {status.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Field */}
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2 ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-black/40 border rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none transition-colors ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-white/10 focus:border-neon-blue'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-400 text-xs mt-1 ml-1">Passwords do not match</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={status.loading} 
            className="w-full bg-neon-blue text-black font-bold py-3.5 rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20"
          >
            {status.loading ? <Loader2 className="animate-spin" /> : "Activate Account"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ActivateAccountPage;