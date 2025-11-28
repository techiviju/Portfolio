import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import api from '../api/axios';
import { 
  Shield, CheckCircle, XCircle, Loader2, UserCheck, 
  Copy, ExternalLink, AlertCircle, Clock, Search, 
  LogOut, Eye, UserX, RefreshCw, Users, Activity, AlertTriangle
} from 'lucide-react';

const AdminPage = () => {
  const { logout, user } = useAuth(); 
  const navigate = useNavigate(); 
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); 
  
  const [selectedRequest, setSelectedRequest] = useState(null); 
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' }); 
  const [confirmationModal, setConfirmationModal] = useState(null); 
  const [portfolioErrorModal, setPortfolioErrorModal] = useState(null); 

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/requests');
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setRequests(sorted);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError("Failed to load data. Verify Admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  const triggerLogout = () => {
    setConfirmationModal({ type: 'logout' });
  };

  const confirmLogout = () => {
    logout(); 
    setConfirmationModal(null);
    // Force hard redirect to ensure clean state logout
    window.location.href = '/auth/login'; 
  };

  const handleViewPortfolio = async (req) => {
    const username = guessUsername(req.name);
    const link = `/u/${username}`;
    
    setActionStatus({ type: 'loading', message: 'Verifying Portfolio...' });
    
    try {
        // Check if user exists/has portfolio
        await api.get(`/users/${username}`);
        window.open(link, '_blank');
        setActionStatus({ type: '', message: '' }); 
    } catch (err) {
        // Show Professional Oops Modal
        setPortfolioErrorModal({ name: req.name, username: username });
        setActionStatus({ type: '', message: '' }); 
    }
  };

  const guessUsername = (name) => {
    if (!name) return '';
    const parts = name.toLowerCase().split(' ');
    const username = parts[0][0] + (parts.length > 1 ? parts[1] : '');
    return username;
  };

  const handleApprove = async (req) => {
    try {
      setActionStatus({ type: 'loading', message: `Approving ${req.name}...` });
      const response = await api.post(`/admin/requests/${req.id}/approve`);
      
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'APPROVED' } : r));

      setSelectedRequest({ 
        ...req, 
        status: 'APPROVED',
        generatedUsername: response.data.username,
        inviteLink: response.data.inviteLink 
      });
      setActionStatus({ type: 'success', message: 'User Approved Successfully' });
    } catch (err) {
      setActionStatus({ type: 'error', message: err.response?.data?.message || "Approval Failed" });
    }
  };

  const handleReject = async (req) => {
    if (!window.confirm(`Reject request from ${req.name}?`)) return; 
    try {
      await api.post(`/admin/requests/${req.id}/reject`);
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'REJECTED' } : r));
      setActionStatus({ type: 'success', message: 'Request Rejected' });
    } catch (err) {
      setActionStatus({ type: 'error', message: "Action Failed" });
    }
  };

  const triggerRevoke = (req) => {
    setConfirmationModal({ type: 'revoke', data: req });
  };

  const confirmRevoke = async () => {
    const req = confirmationModal.data;
    try {
        // FIX: Actual API Call to revoke access
        await api.post(`/admin/requests/${req.id}/revoke`);
        
        // Update Local State to reflect Rejected/Revoked status
        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'REJECTED' } : r));
        setActionStatus({ type: 'success', message: 'Access Revoked Successfully' });
    } catch (error) {
        console.error("Revoke error", error);
        setActionStatus({ type: 'error', message: "Failed to revoke access via API" });
    } finally {
        setConfirmationModal(null);
    }
  };

  const filteredData = requests.filter(req => {
    const matchesFilter = filter === 'ALL' || req.status === filter;
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: requests.length,
    active: requests.filter(r => r.status === 'APPROVED').length,
    pending: requests.filter(r => r.status === 'PENDING').length
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-neon-blue">
      <Loader2 className="animate-spin w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 p-6 lg:p-10 font-sans relative">
      
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="text-neon-green w-8 h-8" /> Admin Console
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, <span className="text-white font-bold">{user?.username || 'Admin'}</span>.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchRequests} 
              className="p-2.5 bg-black/30 hover:bg-black/50 rounded-lg transition-colors border border-white/10 text-gray-400 hover:text-white"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={triggerLogout} 
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all font-bold text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={Users} label="Total Users" value={stats.total} color="text-blue-400" borderColor="border-blue-400/30" />
            <StatCard icon={Activity} label="Active Portfolios" value={stats.active} color="text-neon-green" borderColor="border-neon-green/30" />
            <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="text-yellow-400" borderColor="border-yellow-400/30" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex p-1 bg-white/5 rounded-lg self-start border border-white/5">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                        filter === f ? 'bg-neon-blue/10 text-neon-blue shadow-sm border border-neon-blue/20' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>

        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-30 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-neon-blue focus:outline-none transition-colors"
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto glass rounded-xl overflow-hidden min-h-[400px] border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-500 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="p-5 font-medium pl-8">User Identity</th>
                <th className="p-5 font-medium">Current Status</th>
                <th className="p-5 font-medium">Request Message</th>
                <th className="p-5 font-medium text-right pr-8">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={40} className="opacity-20" />
                      <p>No users found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-neon-blue font-bold text-lg">
                          {req.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{req.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{req.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                        <StatusBadge status={req.status} />
                    </td>
                    <td className="p-5 max-w-xs">
                      <p className="text-gray-300 text-sm line-clamp-1 mb-1" title={req.message}>{req.message}</p>
                      <span className="text-[10px] text-gray-600 flex items-center gap-1">
                        <Clock size={10} /> {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                            {req.status === 'PENDING' && (
                                <>
                                    <button onClick={() => handleReject(req)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject">
                                        <XCircle size={18} />
                                    </button>
                                    <button onClick={() => handleApprove(req)} className="px-4 py-1.5 bg-neon-green text-black text-xs font-bold rounded hover:bg-[#00cc82] flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-neon-green/20">
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                </>
                            )}
                            {req.status === 'APPROVED' && (
                                <>
                                    <button 
                                        onClick={() => handleViewPortfolio(req)}
                                        className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors" 
                                        title="View Live Portfolio"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => triggerRevoke(req)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Revoke Access">
                                        <UserX size={18} />
                                    </button>
                                </>
                            )}
                             {req.status === 'REJECTED' && (
                                <span className="text-xs text-gray-600 italic pr-2">Access Denied</span>
                            )}
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass max-w-md w-full rounded-2xl overflow-hidden border border-neon-green/30 shadow-[0_0_50px_rgba(0,255,163,0.15)]"
            >
                <div className="bg-linear-to-b from-neon-green/10 to-transparent p-8 text-center border-b border-neon-green/10">
                    <div className="w-16 h-16 bg-neon-green text-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-neon-green/30 ring-4 ring-neon-green/20">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Account Created</h3>
                    <p className="text-gray-400 text-sm mt-2">
                        <span className="text-white font-bold">{selectedRequest.name}</span> has been officially approved.
                    </p>
                </div>
                
                <div className="p-8 space-y-5 bg-black/40">
                    <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1.5 tracking-wider">Assigned Username</label>
                        <div className="text-white font-mono text-lg tracking-wide">{selectedRequest.generatedUsername}</div>
                    </div>

                    <div className="bg-black/60 p-4 rounded-xl border border-white/10 group">
                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1.5 tracking-wider">Activation Link</label>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 text-neon-blue text-xs break-all font-mono truncate">
                                {selectedRequest.inviteLink}
                            </code>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedRequest.inviteLink);
                                    setActionStatus({ type: 'success', message: 'Link copied to clipboard' });
                                }}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Copy Link"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            onClick={() => setSelectedRequest(null)} 
                            className="flex-1 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Dismiss
                        </button>
                         <a 
                            href={selectedRequest.inviteLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 bg-neon-green text-black text-sm font-bold py-3 rounded-xl hover:bg-[#00cc82] transition-all shadow-lg shadow-neon-green/20 flex items-center justify-center gap-2"
                        >
                            Activate Now <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmationModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
             <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="glass max-w-sm w-full p-6 rounded-2xl border border-white/10 shadow-2xl"
             >
               <div className="text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    confirmationModal.type === 'logout' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                     {confirmationModal.type === 'logout' ? <LogOut size={28}/> : <AlertTriangle size={28}/>}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {confirmationModal.type === 'logout' ? 'Signing Out' : 'Revoke Access?'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {confirmationModal.type === 'logout' 
                      ? 'Are you sure you want to end your session?' 
                      : `This will disable login for ${confirmationModal.data?.name}.`
                    }
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setConfirmationModal(null)} 
                      className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmationModal.type === 'logout' ? confirmLogout : confirmRevoke}
                      className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-bold"
                    >
                      Confirm
                    </button>
                  </div>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {portfolioErrorModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="glass max-w-sm w-full p-6 rounded-2xl border border-white/10"
             >
                <div className="flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="text-gray-400" size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-1">Oops! Portfolio Not Found</h3>
                   <p className="text-gray-400 text-sm mb-6">
                     <span className="text-neon-green font-bold">{portfolioErrorModal.name}</span> hasn't set up their portfolio yet.
                   </p>
                   <div className="bg-black/40 p-3 rounded-lg w-full mb-4 border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Expected URL</p>
                      <code className="text-xs text-neon-blue font-mono">/u/{portfolioErrorModal.username}</code>
                   </div>
                   <button 
                     onClick={() => setPortfolioErrorModal(null)}
                     className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                   >
                     Got it
                   </button>
                </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actionStatus.message && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-4 z-50 backdrop-blur-md ${
                    actionStatus.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-red-500/10' :
                    actionStatus.type === 'loading' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-blue-500/10' :
                    'bg-neon-green/10 border-neon-green/50 text-neon-green shadow-neon-green/10'
                }`}
            >
               {actionStatus.type === 'loading' && <Loader2 className="animate-spin" size={20} />}
               {actionStatus.type === 'success' && <CheckCircle size={20} />}
               {actionStatus.type === 'error' && <AlertCircle size={20} />}
               <span className="font-medium text-sm">{actionStatus.message}</span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, borderColor }) => (
    <div className={`glass p-6 rounded-2xl border-l-4 ${borderColor} hover:bg-white/5 transition-colors`}>
        <div className="flex justify-between items-start">
            <div>
                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</span>
                <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
            </div>
            <div className={`p-3.5 rounded-xl bg-black/30 border border-white/5 ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        APPROVED: 'bg-neon-green/10 text-neon-green border-neon-green/20',
        REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide shadow-sm ${styles[status] || 'text-gray-500'}`}>
            {status}
        </span>
    );
};

export default AdminPage;