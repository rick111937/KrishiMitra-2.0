import React, { useState, useEffect } from 'react'
import { fetchRecommendations } from '../api/recommendationApi'
import { useAuthStore } from '../store/authStore'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchRecommendations().then(res => setRecommendations(res.data || [])).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          AI Recommendation Engine {user?.name ? `for ${user.name}` : ''}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Smart, actionable insights synthesized from weather, soil, and market models.</p>
      </div>

      {/* Main Advisory Cards List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Priority Actions</h3>
        
        {recommendations.map((item) => {
          let cardStyle = "bg-blue-500/10 border-blue-500/20";
          let badgeColor = "bg-blue-500/20 text-blue-400";
          let dotColor = "bg-blue-400";

          if (item.priority === 'critical') {
            cardStyle = "bg-red-500/10 border-red-500/20";
            badgeColor = "bg-red-500/20 text-red-400";
            dotColor = "bg-red-500";
          } else if (item.priority === 'warning') {
            cardStyle = "bg-yellow-500/10 border-yellow-500/20";
            badgeColor = "bg-yellow-500/20 text-yellow-400";
            dotColor = "bg-yellow-500";
          }

          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className={`glass-card p-6 flex flex-col border ${cardStyle} relative overflow-hidden group transition-all duration-300`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${dotColor} pointer-events-none`}></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 w-full">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                      {item.priority}
                    </span>
                    <span className="text-xs text-slate-500">In: {item.category}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-all">{item.action}</h4>
                  <p className="text-slate-300 text-sm mt-1 mb-2"><span className="text-slate-500">Reason: </span>{item.reason}</p>
                  {item.benefit && <p className="text-slate-400 text-xs"><span className="text-slate-500">Benefit: </span>{item.benefit}</p>}
                </div>

                <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 z-20">
                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${isExpanded ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    {isExpanded ? 'Close Plan' : 'Execute Action'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 transition-all">
                    Inquire AI
                  </button>
                </div>
              </div>

              {/* Action Plan Stepper/Checklist */}
              {isExpanded && item.steps && (
                <div className="w-full mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 z-10 relative animate-fadeIn">
                  <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-1">
                    <span className="text-blue-400">📋</span> Step-by-Step Checklist
                  </h5>
                  {item.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 group/step cursor-pointer">
                      <input type="checkbox" className="mt-1 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50" id={`step-${item.id}-${idx}`} />
                      <label htmlFor={`step-${item.id}-${idx}`} className="text-sm text-slate-300 group-hover/step:text-white cursor-pointer select-none">
                        <span className="text-xs text-slate-500 mr-1 font-mono">{idx + 1}.</span> {step}
                      </label>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
                      Complete Action
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Advisory Confidence Banner */}
      <div className="glass-card p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 flex flex-col gap-1">
        <h4 className="text-sm font-bold">Confidence Intervals</h4>
        <p className="text-xs text-slate-400">Rule-augmented models indicate 92% confidence for Weather actions based on NASA MODIS and OpenWeather accuracy.</p>
      </div>
    </div>
  )
}