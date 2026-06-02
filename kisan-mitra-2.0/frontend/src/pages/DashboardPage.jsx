import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchWeather } from '../api/weatherApi'
import { fetchSoilStats } from '../api/soilApi'
import { fetchPrices } from '../api/marketApi'
import { fetchRiskIndex } from '../api/cropRiskApi'
import { fetchAlerts } from '../api/alertApi'
import { fetchRecommendations } from '../api/recommendationApi'

export default function DashboardPage() {
  const [weatherData, setWeatherData] = useState([])
  const [riskScore, setRiskScore] = useState('--')
  const [soilMoisture, setSoilMoisture] = useState('--%')
  const [marketTrend, setMarketTrend] = useState('--%')
  const [alerts, setAlerts] = useState([])
  const [smartAdvice, setSmartAdvice] = useState(null)
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false)

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  useEffect(() => {
    fetchWeather().then(res => setWeatherData(res.data.forecast || [])).catch(console.error)
    fetchRiskIndex().then(res => setRiskScore(res.data.score || '--')).catch(console.error)
    fetchSoilStats().then(res => {
      if(res.data && res.data.nodes && res.data.nodes[0]) setSoilMoisture(res.data.nodes[0].moisture + '%')
    }).catch(console.error)
    fetchPrices().then(res => {
      if(res.data && res.data.cropPrices && res.data.cropPrices[0]) setMarketTrend(res.data.cropPrices[0].change)
    }).catch(console.error)
    fetchAlerts().then(res => setAlerts(res.data || [])).catch(console.error)
    fetchRecommendations().then(res => {
      if(res.data && res.data[0]) setSmartAdvice(res.data[0])
    }).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header with floating effect */}
      <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Hello, Sandipan</h1>
          <p className="text-slate-400 text-sm mt-1">Here is what's happening on your farm today.</p>
        </div>
        <div className="text-xs font-semibold px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 animate-pulse">
          📍 Hosur, Tamil Nadu
        </div>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Risk */}
        <div className="glass-card flex flex-col gap-2 relative overflow-hidden group animate-float" style={{ animationDelay: '0s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Crop Risk Score</span>
          <span className="text-5xl font-black text-red-500 tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">{riskScore}</span>
          <p className="text-slate-400 text-xs mt-2 line-clamp-2">⚠️ High rainfall prediction within 48h. Action advised.</p>
        </div>

        {/* Card 2: Soil Moisture */}
        <div className="glass-card flex flex-col gap-2 relative overflow-hidden group animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Soil Moisture</span>
          <span className="text-5xl font-black text-green-400 tracking-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">{soilMoisture}</span>
          <p className="text-slate-400 text-xs mt-2">Based on North Field measurements.</p>
        </div>

        {/* Card 3: Rainfall */}
        <div className="glass-card flex flex-col gap-2 relative overflow-hidden group animate-float" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Rainfall (24h)</span>
          <span className="text-5xl font-black text-blue-400 tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">45mm</span>
          <p className="text-slate-400 text-xs mt-2">Heavy rain expected Thursday afternoon.</p>
        </div>

        {/* Card 4: Market Trend */}
        <div className="glass-card flex flex-col gap-2 relative overflow-hidden group animate-float" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Market Trend</span>
          <span className="text-5xl font-black text-yellow-500 tracking-tight drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">{marketTrend}</span>
          <p className="text-slate-400 text-xs mt-2">Standard rate updates from local mandi.</p>
        </div>
      </div>

      {/* Main Grid: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rainfall Predictions Chart */}
        <div className="glass-card lg:col-span-2 flex flex-col gap-4 relative group overflow-hidden">
          <div className="glass-glow"></div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Rainfall and Temperature Trend</h3>
            <span className="text-xs text-slate-500">7-Day Forecast</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weatherData}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} strokeDasharray="3 3" />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions and Alerts */}
        <div className="glass-card flex flex-col gap-4 relative overflow-hidden group">
          <div className="glass-glow"></div>
          <h3 className="text-lg font-bold">Critical Alerts</h3>
          <div className="flex flex-col gap-3 mt-1">
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert.id} className={`p-4 bg-gradient-to-r from-${alert.type === 'critical'?'red':'yellow'}-500/10 to-transparent border-l-4 border-${alert.type === 'critical'?'red':'yellow'}-500 rounded-xl flex items-start gap-3 transition-all hover:translate-x-1 relative group`}>
                <div className={`w-1.5 h-1.5 rounded-full bg-${alert.type === 'critical'?'red':'yellow'}-500 mt-2`}></div>
                <div>
                  <p className={`text-sm font-bold text-${alert.type === 'critical'?'red':'yellow'}-100`}>{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{alert.message}</p>
                </div>
                <button 
                  onClick={() => handleDismissAlert(alert.id)}
                  className="absolute top-3 right-3 p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity bg-black/20 rounded-full hover:bg-black/40"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )) : <p className="text-xs text-slate-500">No active alerts.</p>}
          </div>

          <h3 className="text-lg font-bold mt-3">Smart Advice</h3>
          <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-xl relative overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl -z-10 group-hover:scale-110 transition-all"></div>
            <p className="text-sm font-bold text-blue-200">{smartAdvice? smartAdvice.action : 'Delay irrigation for 48 hours.'}</p>
            <p className="text-xs text-slate-300 mt-1">{smartAdvice? smartAdvice.reason : 'Sufficient rainfall expected soon. Over-watering causes root damage.'}</p>
            <button 
              onClick={() => setIsAdviceModalOpen(true)}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold py-2 rounded-lg transition-all shadow-md shadow-blue-500/20"
            >
              View Action Plan
            </button>
          </div>
        </div>
      </div>

      {isAdviceModalOpen && smartAdvice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6 relative flex flex-col gap-4 border border-white/10 animate-scaleUp">
            <div>
              <span className="text-[10px] font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20">Action Plan</span>
              <h3 className="text-xl font-bold text-white mt-2">{smartAdvice.action}</h3>
              <p className="text-slate-400 text-xs mt-1">{smartAdvice.reason}</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <h4 className="text-xs font-bold text-slate-300">STEP-BY-STEP CHECKLIST</h4>
              <div className="flex flex-col gap-3">
                {smartAdvice.steps && smartAdvice.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 mt-0.5 border border-blue-500/30">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-200 mt-1 flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setIsAdviceModalOpen(false)} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20">Understand & Close</button>
          </div>
        </div>
      )}
    </div>
  )
}