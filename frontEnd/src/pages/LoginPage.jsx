import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Key, Lock, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path (e.g., if user was kicked out to login screen) or default
  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    const result = await login(credentials.usernameOrEmail, credentials.password);

    if (result.success) {
      // --- ADMIN REDIRECT FIX ---
      const roles = result.user?.roles || [];
      
      // Robust check for both ["ROLE_ADMIN"] and [{authority: "ROLE_ADMIN"}]
      const isAdmin = roles.some(role => {
          const roleName = typeof role === 'string' ? role : role.authority || role.name;
          return roleName === 'ROLE_ADMIN' || roleName === 'ROLE_SUPER_ADMIN';
      });

      if (isAdmin) {
        navigate('/admin');
      } else if (from) {
        navigate(from);
      } else {
        navigate('/dashboard');
      }
    } else {
      setStatus({ loading: false, error: result.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neon-green/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md glass border border-white/10 p-8 rounded-2xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Key className="text-neon-green w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access your space.</p>
        </div>

        {status.error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} /> {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2 ml-1">Username or Email</label>
            <div className="relative">
              <input 
                type="text" 
                name="usernameOrEmail"
                value={credentials.usernameOrEmail}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input 
                type="password" 
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                placeholder="••••••••"required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status.loading}
            className="w-full bg-neon-green text-black font-bold py-3.5 rounded-lg hover:bg-[#00cc82] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-neon-green/20"
          >
            {status.loading ? <Loader2 className="animate-spin" /> : "Access Account"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/request-account" className="text-neon-blue hover:underline font-medium">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;