import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { fetchAlerts } from '../../api/alertApi'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const [alerts, setAlerts] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    fetchAlerts().then(res => setAlerts(res.data || [])).catch(console.error);
  }, []);

  const handleDismissDropdownAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="text-xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">Kisan-Mitra</span>
      </Link>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search farm diagnostics..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 8.87v5.288c0 .386-.147.752-.405 1.045L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            )}
          </button>

          {isDropdownOpen && (
             <div className="absolute top-12 right-0 w-80 bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl z-50 animate-scaleUp">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Notifications ({alerts.length})</span>
                   <button onClick={() => setIsDropdownOpen(false)} className="text-slate-400 hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                   {alerts.length > 0 ? alerts.map((alert) => (
                      <div key={alert.id} className="p-3 bg-white/3 hover:bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1 relative group">
                         <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                             <span className="text-xs font-bold text-slate-200">{alert.title}</span>
                         </div>
                         <p className="text-[10px] text-slate-400">{alert.message}</p>

                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDismissDropdownAlert(alert.id); }}
                            className="absolute top-2 right-2 p-1 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                         >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                      </div>
                   )) : (
                      <p className="text-center py-4 text-xs text-slate-500">No active alerts.</p>
                   )}
                </div>
             </div>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl hover:bg-white/[0.05] transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform uppercase">
              {user.name[0]}
            </div>
            <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{user.name}</span>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 ml-2 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-all border border-white/5">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl hover:bg-white/[0.05] transition-all group">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-black text-slate-300 shadow-md group-hover:scale-105 transition-transform">
              ?
            </div>
            <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
