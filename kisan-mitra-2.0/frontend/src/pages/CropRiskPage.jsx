import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { fetchRiskIndex } from '../api/cropRiskApi'

export default function CropRiskPage() {
  const [riskScore, setRiskScore] = useState('--')
  const [riskBreakdown, setRiskBreakdown] = useState([])
  const [recentIncidents, setRecentIncidents] = useState([])
  const [mitigations, setMitigations] = useState([])

  useEffect(() => {
    fetchRiskIndex().then(res => {
      setRiskScore(res.data.score || '--')
      setRiskBreakdown(res.data.breakdown || [])
      setRecentIncidents(res.data.incidents || [])
      if(res.data.mitigations) setMitigations(res.data.mitigations)
    }).catch(console.error)
  }, [])

  const handleMitigate = (id, reduction) => {
    setMitigations(prev => prev.filter(m => m.id !== id));
    setRiskScore(prev => Math.max(0, Number(prev) - reduction));
  };

  const scoreColor = riskScore > 75 ? 'text-red-500' : riskScore > 50 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Crop Damage Risk</h1>
        <p className="text-slate-400 text-sm mt-1">Predictive analysis of environmental threat thresholds per crop node.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Risk Gauge Meter */}
        <div className="glass-card flex flex-col items-center justify-center p-8 text-center relative gap-4">
          <div className="absolute inset-0 bg-red-500/5 backdrop-blur-3xl rounded-2xl"></div>
          
          <h3 className="text-lg font-bold text-slate-200">Aggregate Risk Index</h3>
          
          <div className="w-48 h-48 relative flex items-center justify-center mt-4 border-4 border-white/5 rounded-full bg-black/40 shadow-inner">
            <div className="absolute inset-4 rounded-full border-b-[8px] border-red-500 transform rotate-45"></div>
            <div className="flex flex-col items-center">
              <span className={`text-5xl font-black ${scoreColor}`}>{riskScore}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Score</span>
            </div>
          </div>

          <p className="text-sm font-semibold text-red-400 mt-2">Significant Damage Predicted</p>
          <p className="text-slate-400 text-xs text-center max-w-xs">Elevated threat due to forecasted extreme weather within the next 48-72 hours.</p>
        </div>

        {/* Contributing Factors (PieChart) */}
        <div className="glass-card flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-lg font-bold">Contributing Risk Factors</h3>
          <p className="text-slate-400 text-xs">Weighted breakdown of environmental inputs.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-1">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {riskBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 w-full">
              {riskBreakdown.map((item) => (
                <div key={item.name} className="p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mitigation Countermeasures */}
      <div className="glass-card flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Risk Mitigation Countermeasures</h3>
            <p className="text-slate-400 text-xs mt-1">Implement these actions to lower the Aggregate Risk Index.</p>
          </div>
          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-lg font-bold border border-green-500/20">Target: Safe Threshold</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {mitigations.length > 0 ? mitigations.map((item) => (
            <div key={item.id} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-all relative">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.factor}</span>
                 <span className="text-xs font-black text-green-400">-{item.reduction}% Risk</span>
               </div>
               <p className="text-sm font-bold text-white mt-1">{item.action}</p>
               <button 
                 onClick={() => handleMitigate(item.id, item.reduction)}
                 className="mt-3 w-full py-1.5 bg-blue-600/20 hover:bg-blue-600 text-white rounded-lg text-xs font-bold border border-blue-500/20 transition-all active:scale-95"
               >
                 Mark as Completed
               </button>
            </div>
          )) : (
            <div className="col-span-3 text-center py-4 text-xs text-green-400 font-bold">
              🎉 Optimal safety constraints met. No mitigation alerts.
            </div>
          )}
        </div>
      </div>

      {/* Historical Incidents / Records Table */}
      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4">Historical Risk Analytics & Advisories</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Primary Factor</th>
                <th className="px-4 py-3">Damage Level</th>
                <th className="px-4 py-3">Corrective Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-white/5 transition-all">
                  <td className="px-4 py-3">{incident.date}</td>
                  <td className="px-4 py-3">{incident.factor}</td>
                  <td className={`px-4 py-3 font-semibold ${incident.damage.includes('High') ? 'text-red-400' : incident.damage.includes('Medium') ? 'text-yellow-400' : 'text-green-400'}`}>{incident.damage}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{incident.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}