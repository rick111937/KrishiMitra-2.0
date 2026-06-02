import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchSoilStats } from '../api/soilApi'

export default function SoilAnalysisPage() {
  const [nodeData, setNodeData] = useState([])
  const [historicalMoisture, setHistoricalMoisture] = useState([])
  const [nutrients, setNutrients] = useState({ n: 0, p: 0, k: 0, ph: 7 })

  useEffect(() => {
    fetchSoilStats().then(res => {
      setNodeData(res.data.nodes || [])
      setHistoricalMoisture(res.data.historicalMoisture || [])
      if(res.data.nutrients) setNutrients(res.data.nutrients)
    }).catch(console.error)
  }, [])
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Soil Moisture Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Satellite and sensor-based real-time root zone monitoring.</p>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodeData.map((node) => {
          const strokeDashactive = (node.moisture / 100) * 283; // Circumference = 2 * pi * r (r=45) => 282.7
          let strokeColor = "stroke-green-500";
          let bgColor = "bg-green-500/10";
          let textColor = "text-green-400";
          
          if (node.moisture > 80) { strokeColor = "stroke-blue-500"; bgColor = "bg-blue-500/10"; textColor = "text-blue-400"; }
          if (node.moisture < 50) { strokeColor = "stroke-yellow-500"; bgColor = "bg-yellow-500/10"; textColor = "text-yellow-400"; }
          if (node.moisture < 40) { strokeColor = "stroke-red-500"; bgColor = "bg-red-500/10"; textColor = "text-red-400"; }

          return (
            <div key={node.id} className="glass-card flex flex-col items-center gap-4 relative">
              <span className="text-sm font-semibold text-slate-200 text-center line-clamp-1">{node.name}</span>
              
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle 
                    cx="64" cy="64" r="45" fill="transparent" 
                    className={strokeColor} 
                    strokeWidth="10" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - strokeDashactive} 
                    strokeLinecap="round" 
                    transition="stroke-dashoffset 0.5s ease"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black">{node.moisture}%</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>{node.status}</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-xs">Condition: <span className="text-slate-200">{node.health}</span></p>
            </div>
          )
        })}
      </div>

      {/* Nutrients & pH Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-lg font-bold">Soil pH Balance</h3>
          <p className="text-slate-400 text-xs">Ideal range: 6.0 - 7.0 (Slightly Acidic to Neutral)</p>
          <div className="relative mt-6 mb-4">
            <div className="h-3 w-full bg-gradient-to-r from-red-500 via-green-500 to-purple-500 rounded-full"></div>
            {/* Marker for pH */}
            <div className="absolute top-[-8px] flex flex-col items-center" style={{ left: `${(nutrients.ph / 14) * 100}%` }}>
              <div className="w-4 h-4 bg-white border-2 border-slate-900 rounded-full shadow-md animate-ping absolute"></div>
              <div className="w-4 h-4 bg-white border-2 border-slate-900 rounded-full shadow-md z-10"></div>
              <span className="text-xs font-bold text-white mt-1">{nutrients.ph}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>Acidic (0)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (14)</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 rounded-lg w-fit mt-2 ${nutrients.ph >= 6 && nutrients.ph <= 7 ? '':'bg-yellow-500/10 text-yellow-400'}`}>
            {nutrients.ph >= 6 && nutrients.ph <= 7 ? 'Optimal range for Crops' : 'Requires Conditioning'}
          </span>
        </div>

        <div className="glass-card lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold">NPK Nutrient Composition</h3>
          <div className="grid grid-cols-3 gap-6 h-full flex-1 items-center">
            {/* Nitrogen */}
            <div className="flex flex-col items-center gap-1">
               <span className="text-3xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">N</span>
               <span className="text-xs font-bold text-slate-400">Nitrogen</span>
               <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${nutrients.n}%` }}></div>
               </div>
               <span className={`text-[10px] font-bold mt-1 ${nutrients.n < 50 ? 'text-red-400' : 'text-green-400'}`}>
                 {nutrients.n < 50 ? `Deficient (${nutrients.n}%)` : `Optimal (${nutrients.n}%)`}
               </span>
            </div>

            {/* Phosphorous */}
            <div className="flex flex-col items-center gap-1 border-x border-white/5 px-4">
               <span className="text-3xl font-black bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">P</span>
               <span className="text-xs font-bold text-slate-400">Phosphorus</span>
               <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${nutrients.p}%` }}></div>
               </div>
               <span className={`text-[10px] font-bold mt-1 ${nutrients.p < 50 ? 'text-red-400' : 'text-green-400'}`}>
                 {nutrients.p < 50 ? `Deficient (${nutrients.p}%)` : `Optimal (${nutrients.p}%)`}
               </span>
            </div>

            {/* Potassium */}
            <div className="flex flex-col items-center gap-1">
               <span className="text-3xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">K</span>
               <span className="text-xs font-bold text-slate-400">Potassium</span>
               <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${nutrients.k}%` }}></div>
               </div>
               <span className={`text-[10px] font-bold mt-1 ${nutrients.k < 50 ? 'text-red-400' : 'text-green-400'}`}>
                 {nutrients.k < 50 ? `Deficient (${nutrients.k}%)` : `Optimal (${nutrients.k}%)`}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Imagery View and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Satellite Mapper */}
        <div className="glass-card lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold">Satellite Visual Mapping (NASA MODIS)</h3>
          <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-white/5 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 via-slate-900/80 to-purple-900/50 mix-blend-multiply"></div>
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" 
              alt="Farm satellite view mock" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
            {/* Overlay Grid */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-20"><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div><div className="border border-white/20"></div></div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Live Feed: NDVI Index</span>
            </div>

            <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-400 bg-black/40 p-2 rounded-lg">
              Lat: 12.532 | Long: 77.821
            </div>
          </div>
        </div>

        {/* Historical line graph */}
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-lg font-bold">Historical Moisture Trend</h3>
          <p className="text-slate-400 text-xs">4-Week Node comparison.</p>
          <div className="h-64 flex-1 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalMoisture}>
                <XAxis dataKey="week" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="north" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="south" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="west" stroke="#eab308" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}