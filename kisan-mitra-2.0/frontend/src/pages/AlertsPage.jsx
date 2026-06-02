import React, { useState, useEffect } from 'react'
import { fetchAlerts } from '../api/alertApi'

export default function AlertsPage() {
  const [alertsConfig, setAlertsConfig] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [prefs, setPrefs] = useState({ sms: true, banners: true, voice: false })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showSmsModal, setShowSmsModal] = useState(false)

  const handleEnableAndTestSMS = () => {
    setPrefs(prev => ({ ...prev, sms: true }));
    setShowSmsModal(true);
    setTimeout(() => setShowSmsModal(false), 5000);
  }

  useEffect(() => {
    fetchAlerts().then(res => setAlertsConfig(res.data || [])).catch(console.error)
  }, [])

  const handleMarkAsRead = (id) => {
    setAlertsConfig(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleMarkAllRead = () => {
    setAlertsConfig(prev => prev.map(a => ({ ...a, read: true })));
  };

  const handleSaveConfigs = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Notifications & Alerts</h1>
          <p className="text-slate-400 text-sm mt-1">Configure threshold dispatching options and history feeds.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all text-slate-200"
        >
          Mark all as read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Feed */}
        <div className="glass-card lg:col-span-2 flex flex-col gap-4">
          <div className="flex gap-4 border-b border-white/5 pb-2 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('all')}
              className={`${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'} pb-2 px-1 transition-all`}
            >
              All ({alertsConfig.length})
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`${activeTab === 'unread' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'} pb-2 px-1 transition-all`}
            >
              Unread ({alertsConfig.filter(a => !a.read).length})
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            {alertsConfig.filter(item => activeTab === 'unread' ? !item.read : true).map((item) => {
              let statusColor = "bg-blue-500/10 border-blue-500/30 text-blue-400";
              let dotColor = "bg-blue-400";
              if (item.type === 'critical') { statusColor = "bg-red-500/10 border-red-500/30 text-red-400"; dotColor = "bg-red-500"; }
              if (item.type === 'warning') { statusColor = "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"; dotColor = "bg-yellow-500"; }

              return (
                <div 
                  key={item.id} 
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`p-4 rounded-xl border flex justify-between items-start gap-3 transition-all cursor-pointer hover:bg-white/5 ${statusColor} ${!item.read ? 'border-l-[4px]' : ''}`}
                >
                  <div className="flex gap-2 items-start">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ${dotColor} ${!item.read ? 'animate-pulse' : 'opacity-40'}`}></div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide">{item.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{item.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Configurations pane */}
        <div className="flex flex-col gap-4">
          <div className="glass-card flex flex-col gap-4">
            <h3 className="text-lg font-bold">Alert Preferences</h3>
            <p className="text-slate-400 text-xs">Manage how you receive critical warnings.</p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-slate-200">SMS Notifications</span>
                <input 
                  type="checkbox" 
                  checked={prefs.sms} 
                  onChange={(e) => setPrefs({ ...prefs, sms: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-white/10 bg-black/40" 
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-slate-200">Dashboard Banners</span>
                <input 
                  type="checkbox" 
                  checked={prefs.banners} 
                  onChange={(e) => setPrefs({ ...prefs, banners: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-white/10 bg-black/40" 
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-slate-200">Voice Summary alerts</span>
                <input 
                  type="checkbox" 
                  checked={prefs.voice} 
                  onChange={(e) => setPrefs({ ...prefs, voice: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-white/10 bg-black/40" 
                />
              </div>

              <button 
                onClick={handleSaveConfigs}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Preferences'}
              </button>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-blue-500/10 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">Recommended Config</h3>
            <p className="text-xs text-slate-300">Enable **SMS Alerts** for critical rain score triggers during harvest season.</p>
            <button 
              onClick={handleEnableAndTestSMS}
              className="mt-1 w-full py-2 bg-indigo-500/20 hover:bg-indigo-500 hover:text-white text-indigo-200 text-xs font-bold rounded-xl border border-indigo-500/20 transition-all flex items-center justify-center gap-1 shadow-md hover:scale-[1.02]"
            >
              Enable & Test SMS
            </button>
          </div>
        </div>
      </div>
      {showSmsModal && (
         <>
         <style>{`
           @keyframes slideDownSMS {
             from { transform: translate(-50%, -40px); opacity: 0; }
             to { transform: translate(-50%, 0); opacity: 1; }
           }
           .animate-slideDownSMS { animation: slideDownSMS 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
         `}</style>
         <div className="fixed top-6 left-1/2 -translate-x-1/2 w-85 max-w-[90vw] bg-slate-950/90 backdrop-blur-lg border border-indigo-500/30 rounded-2xl p-4 shadow-2xl z-[100] animate-slideDownSMS flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">SMS SIMULATION</span>
                  <span className="text-[9px] text-slate-500">Just Now</span>
               </div>
               <p className="text-sm font-black text-slate-200 mt-0.5">Kisan-Mitra Alert</p>
               <p className="text-xs text-slate-400 leading-normal mt-0.5">🚨 Critical: 45mm Heavy Rain expected in 48h. Secure crops & check drainage nets.</p>
            </div>
         </div>
         </>
      )}
    </div>
  )
}