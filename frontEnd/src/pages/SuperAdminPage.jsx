import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // ✅ Uses your local axios instance
import { 
    Shield, Trash2, Activity, Search, AlertTriangle, 
    CheckCircle, Loader2, UserCog, Zap, Key, 
    ChevronUp, ChevronDown, RefreshCw, Power, Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdminPage = () => {
    // --- State ---
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals & Actions
    const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
    const [deleteModal, setDeleteModal] = useState(null);
    const [passwordModal, setPasswordModal] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    // --- Initial Fetch ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, logsRes] = await Promise.all([
                api.get('/super/stats'),
                api.get('/super/users'),
                api.get('/super/audit-logs')
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAuditLogs(logsRes.data);
        } catch (err) {
            console.error("Super Admin Load Error:", err);
            showToast('error', 'Failed to load system data. Check permissions.');
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const showToast = (type, message) => {
        setActionStatus({ type, message });
        setTimeout(() => setActionStatus({ type: '', message: '' }), 4000);
    };

    const refreshLogs = async () => {
        try {
            const res = await api.get('/super/audit-logs');
            setAuditLogs(res.data);
        } catch (e) { /* silent fail */ }
    };

    // 1. Handle Promote/Demote (Send Body)
    const toggleRole = async (user) => {
        const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
        const actionName = newRole === 'ROLE_ADMIN' ? 'Promoted' : 'Demoted';

        // Optimistic Update
        const previousUsers = [...users];
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));

        try {
            // Backend: @RequestBody RoleUpdateRequest
            await api.put(`/super/users/${user.id}/role`, { role: newRole });
            
            showToast('success', `User ${actionName} Successfully`);
            refreshLogs();
        } catch (err) {
            setUsers(previousUsers); // Revert on error
            showToast('error', `Failed to ${actionName.toLowerCase()} user.`);
        }
    };

    // 2. Handle Status Toggle (Send Query Param)
    const toggleUserStatus = async (user) => {
        const newEnabledState = !user.enabled;
        const actionName = newEnabledState ? 'Activated' : 'Deactivated';

        // Optimistic Update
        const previousUsers = [...users];
        setUsers(users.map(u => u.id === user.id ? { ...u, enabled: newEnabledState } : u));

        try {
            // Backend: @RequestParam boolean enabled
            // URL will look like: /api/super/users/2/status?enabled=true
            await api.put(`/super/users/${user.id}/status?enabled=${newEnabledState}`);
            
            showToast('success', `User ${actionName} Successfully`);
            refreshLogs();
        } catch (err) {
            console.error("Status Update Failed:", err);
            setUsers(previousUsers); // Revert
            const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to change status";
            showToast('error', errMsg);
        }
    };

    // 3. Handle Password Reset (Send Body)
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!passwordModal || !newPassword) return;

        try {
            // Backend: @RequestBody PasswordResetRequest
            await api.post(`/super/users/${passwordModal.id}/reset-password`, { newPassword });
            
            showToast('success', `Password for ${passwordModal.username} has been reset.`);
            setPasswordModal(null);
            setNewPassword('');
            refreshLogs();
        } catch (err) {
            showToast('error', err.response?.data?.error || 'Reset failed');
        }
    };

    // 4. Handle Hard Delete
    const confirmDelete = async () => {
        if (!deleteModal) return;
        try {
            await api.delete(`/super/users/${deleteModal.id}`);
            setUsers(users.filter(u => u.id !== deleteModal.id));
            showToast('success', 'User and Portfolio permanently deleted.');
            refreshLogs();
        } catch (err) {
            showToast('error', 'Delete failed.');
        } finally {
            setDeleteModal(null);
        }
    };

    // --- Helpers ---
    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-gray-200 font-sans relative pb-20">
            
            {/* --- Header --- */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border-b border-white/5 backdrop-blur-xl sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Zap className="text-purple-400 fill-purple-400/20 w-8 h-8" /> 
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                    Super Admin
                                </span>
                            </h1>
                            <p className="text-purple-300/60 mt-1 text-sm font-mono tracking-wide">
                                SYSTEM OVERRIDE ACTIVE
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <StatBadge label="Users" value={stats?.totalUsers || 0} />
                            <StatBadge label="Admins" value={stats?.adminCount || 0} />
                            <StatBadge label="Approval Rate" value={`${stats?.approvalRate || 0}%`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT COL: User Database --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <UserCog className="text-purple-400" size={20} /> User Database
                        </h2>
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:border-purple-500 outline-none w-64 transition-all focus:w-72 text-white"
                            />
                        </div>
                    </div>

                    <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-xs uppercase text-gray-400 font-bold tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="p-5 pl-6">Identity</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5">Current Role</th>
                                    <th className="p-5 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className={`hover:bg-white/5 transition-colors group ${!user.enabled ? 'opacity-60 hover:opacity-100' : ''}`}>
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                                                    user.role === 'ROLE_ADMIN' 
                                                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30' 
                                                    : 'bg-gray-800 text-gray-400 border border-white/5'
                                                }`}>
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-2">
                                                        {user.username}
                                                        {user.hasPortfolio && (
                                                            <span title="Has Portfolio" className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    user.enabled 
                                                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                                                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                                                }`}>
                                                    {user.enabled ? <CheckCircle size={10} /> : <Ban size={10} />}
                                                    {user.enabled ? 'Active' : 'Inactive'}
                                                </span>
                                                {user.status && (
                                                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tight">
                                                        {user.status}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="p-5 text-right pr-6">
                                            {user.role !== 'ROLE_SUPER_ADMIN' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    
                                                    {/* 1. Promote/Demote */}
                                                    <button 
                                                        onClick={() => toggleRole(user)}
                                                        className={`p-2 rounded-lg border transition-all ${
                                                            user.role === 'ROLE_ADMIN' 
                                                            ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' 
                                                            : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                                                        }`}
                                                        title={user.role === 'ROLE_ADMIN' ? "Demote to User" : "Promote to Admin"}
                                                    >
                                                        {user.role === 'ROLE_ADMIN' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                                    </button>

                                                    {/* 2. Enable/Disable (Re-Approval) */}
                                                    <button 
                                                        onClick={() => toggleUserStatus(user)}
                                                        className={`p-2 rounded-lg border transition-all ${
                                                            user.enabled
                                                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                            : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                                        }`}
                                                        title={user.enabled ? "Deactivate User" : "Re-Approve / Activate User"}
                                                    >
                                                        {user.enabled ? <Ban size={16} /> : <Power size={16} />}
                                                    </button>

                                                    {/* 3. Reset Password */}
                                                    <button 
                                                        onClick={() => setPasswordModal(user)}
                                                        className="p-2 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/20 rounded-lg border border-yellow-500/20 transition-colors"
                                                        title="Reset Password"
                                                    >
                                                        <Key size={16} />
                                                    </button>

                                                    {/* 4. Delete */}
                                                    <button 
                                                        onClick={() => setDeleteModal(user)}
                                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Hard Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
                                <Search size={32} className="opacity-20"/>
                                <span>No matching users found.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COL: Audit Logs --- */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <Activity className="text-blue-400" size={20} /> System Feed
                        </h2>
                        <button 
                            onClick={refreshLogs} 
                            className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                            title="Refresh Logs"
                        >
                            <RefreshCw size={16}/>
                        </button>
                    </div>
                    
                    <div className="glass rounded-xl border border-white/10 p-0 overflow-hidden h-[600px] overflow-y-auto custom-scrollbar relative">
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5"></div>
                        <div className="divide-y divide-white/5">
                            {auditLogs.map((log) => {
                                // Determine styling based on action type
                                let iconColor = 'bg-gray-500';
                                
                                if (log.action.includes('DELETE')) { iconColor = 'bg-red-500'; }
                                else if (log.action.includes('ROLE')) { iconColor = 'bg-blue-500'; }
                                else if (log.action.includes('PASSWORD')) { iconColor = 'bg-yellow-500'; }
                                else if (log.action.includes('APPROVED') || log.action.includes('STATUS')) { iconColor = 'bg-green-500'; }
                                
                                return (
                                    <div key={log.id} className="p-4 pl-12 relative hover:bg-white/5 transition-colors group">
                                        <div className={`absolute left-[1.35rem] top-5 w-2.5 h-2.5 rounded-full ${iconColor} ring-4 ring-black/50 group-hover:scale-125 transition-transform`}></div>
                                        
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                @{log.actor}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-200 font-medium leading-snug">
                                            {log.action.replace(/_/g, ' ')}
                                        </p>
                                        {log.target && (
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                Target: <span className="text-gray-300 font-mono">{log.target}</span>
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            {auditLogs.length === 0 && (
                                <div className="p-6 text-center text-gray-600 text-sm italic">System logs are empty.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL: Reset Password --- */}
            <AnimatePresence>
                {passwordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass max-w-sm w-full p-6 rounded-2xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/10"
                        >
                            <form onSubmit={handlePasswordReset}>
                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                                        <Key size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Reset Password</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Set a new password for <span className="text-white font-bold">{passwordModal.username}</span>
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <input 
                                        type="text" 
                                        autoFocus
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none text-center font-mono tracking-wider"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setPasswordModal(null); setNewPassword(''); }}
                                        className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={!newPassword.trim()}
                                        className="flex-1 py-3 rounded-lg bg-yellow-600 text-white hover:bg-yellow-500 font-bold text-sm transition-colors shadow-lg shadow-yellow-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: Delete Confirmation --- */}
            <AnimatePresence>
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass max-w-sm w-full p-6 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/10"
                        >
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                    <AlertTriangle size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Hard Delete User?</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    You are about to permanently delete <span className="text-white font-bold">{deleteModal.username}</span>.
                                </p>
                                <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg mb-6 text-left">
                                    <ul className="text-xs text-red-300 space-y-1 list-disc pl-4">
                                        <li>User account will be removed.</li>
                                        <li>Portfolio data will be destroyed.</li>
                                        <li>This action <b>cannot</b> be undone.</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setDeleteModal(null)}
                                        className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        className="flex-1 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold text-sm transition-colors shadow-lg shadow-red-600/20"
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- TOAST NOTIFICATION --- */}
            <AnimatePresence>
                {actionStatus.message && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-3 z-50 backdrop-blur-md ${
                            actionStatus.type === 'error' 
                            ? 'bg-red-900/80 border-red-500/50 text-red-100' 
                            : 'bg-purple-900/80 border-purple-500/50 text-purple-100'
                        }`}
                    >
                        {actionStatus.type === 'error' ? <AlertTriangle size={20}/> : <CheckCircle size={20}/>}
                        <span className="font-medium text-sm">{actionStatus.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub Components ---

const StatBadge = ({ label, value }) => (
    <div className="hidden md:block bg-black/30 border border-white/5 rounded-lg px-4 py-2">
        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</div>
        <div className="text-xl font-bold text-white font-mono">{value}</div>
    </div>
);

const RoleBadge = ({ role }) => {
    const config = {
        'ROLE_SUPER_ADMIN': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        'ROLE_ADMIN': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        'ROLE_USER': 'text-gray-400 bg-gray-500/10 border-gray-500/10'
    };
    const style = config[role] || config['ROLE_USER'];
    
    return (
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${style}`}>
            {role.replace('ROLE_', '')}
        </span>
    );
};

export default SuperAdminPage;