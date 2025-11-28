import React, { useState } from 'react';
import api from '../api/axios'; // Import the axios messenger
import { Loader2, CheckCircle } from 'lucide-react';

const RequestAccountPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      // 1. Send data to Backend API (POST /api/requests)
      await api.post('/requests', formData);
      
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      // 2. Handle errors gracefully
      console.error("Submission Error:", err); // Log for debugging
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.error || 'Failed to submit request. Server might be offline.' 
      });
    }
  };

  // 3. Success State UI
  if (status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <div className="glass p-8 rounded-lg w-full max-w-md text-center border border-white/10">
          <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-gray-400">The admin will review your request shortly.</p>
          <button 
            onClick={() => setStatus({ ...status, success: false })} 
            className="mt-6 text-neon-green hover:underline font-medium"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  // 4. Form UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
      <div className="glass p-8 rounded-lg w-full max-w-md border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-6 text-neon-green">Request an Account</h2>
        
        {status.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-neon-green focus:outline-none transition-colors" 
              required 
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-neon-green focus:outline-none transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              rows="3" 
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-neon-green focus:outline-none resize-none transition-colors"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={status.loading} 
            className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:bg-[#00cc82] transition-colors flex justify-center shadow-neon-green"
          >
            {status.loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestAccountPage;