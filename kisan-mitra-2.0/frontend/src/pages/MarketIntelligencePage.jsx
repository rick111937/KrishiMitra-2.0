import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchPrices } from '../api/marketApi'

export default function MarketIntelligencePage() {
  const [cropPrices, setCropPrices] = useState([])
  const [chartData, setChartData] = useState([])
  const [mandiComparison, setMandiComparison] = useState([])
  const [isBestMandiModalOpen, setIsBestMandiModalOpen] = useState(false)
  const [isGpayOpen, setIsGpayOpen] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  useEffect(() => {
    fetchPrices().then(res => {
      setCropPrices(res.data.cropPrices || [])
      setChartData(res.data.historicalPrices || [])
      setMandiComparison(res.data.mandiComparison || [])
    }).catch(console.error)
  }, [])
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Market Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time crop pricing trends and mandis comparison.</p>
        </div>
        <button 
          onClick={() => setIsBestMandiModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all"
        >
          Identify Best Mandi
        </button>
      </div>

      {/* Grid: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cropPrices.map((item) => (
          <div key={item.id} className="glass-card flex flex-col gap-2 relative group overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-slate-400 text-xs font-medium">{item.crop}</span>
            <span className="text-2xl font-black">₹{item.price} <span className="text-xs text-slate-500">/ quintal</span></span>
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {item.change}
              </span>
              <span className="text-slate-500 text-xs">{item.mandi}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Chart */}
        <div className="glass-card lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold">Price Index Trend (15 Days)</h3>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="Wheat" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                <Area type="monotone" dataKey="Rice" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mandi comparison table or sidebar */}
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-lg font-bold">Mandi Comparison</h3>
          <p className="text-slate-400 text-xs">Recommended places to sell based on cost models.</p>
          <div className="flex flex-col gap-3 mt-2">
            {mandiComparison.map((item) => (
              <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">{item.mandi}</p>
                  <p className="text-xs text-slate-400">Distance: {item.distance} km</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>₹{item.price}</p>
                  <p className={`text-xs ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{item.change}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-auto">
            <p className="text-xs font-semibold text-yellow-200">💡 Profit Advice</p>
            <p className="text-xs text-slate-300 mt-1">Indore offers ₹100 extra per quintal. Additional transit fee: ₹20. Net profit increases by ₹80.</p>
          </div>
        </div>
      </div>
      {isBestMandiModalOpen && mandiComparison.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6 relative flex flex-col gap-4 border border-white/10 animate-scaleUp">
            <div>
              <span className="text-[10px] font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/20">AI Recommendation</span>
              <h3 className="text-xl font-bold text-white mt-2">Optimal Selling Point</h3>
              <p className="text-slate-400 text-xs mt-1">Based on Net Profit = Price - Transport Cost (₹2.5/km)</p>
            </div>

            {(() => {
              const evaluated = mandiComparison.map(m => ({
                ...m,
                netProfit: m.price - (m.distance * 2.5)
              })).sort((a,b) => b.netProfit - a.netProfit);
              const best = evaluated[0];

              return (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                     <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded-lg">BEST NET</div>
                     <span className="text-xs text-green-400 font-semibold">{best.mandi}</span>
                     <span className="text-2xl font-black">₹{best.netProfit.toFixed(0)} <span className="text-xs text-slate-400">Net Profit</span></span>
                     <div className="flex justify-between text-[10px] text-slate-400 mt-2 border-t border-white/5 pt-2">
                       <span>Market Price: ₹{best.price}</span>
                       <span>Transport: ₹{(best.distance * 2.5).toFixed(0)}</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <h4 className="text-xs font-bold text-slate-400">ALTERNATIVES</h4>
                    {evaluated.slice(1,3).map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                        <span className="text-slate-300">{item.mandi} ({item.distance}km)</span>
                        <div className="text-right">
                          <span className="font-bold">₹{item.netProfit.toFixed(0)}</span>
                          <p className="text-[10px] text-slate-500">₹{(item.distance * 2.5).toFixed(0)} cost</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setIsBestMandiModalOpen(false)} className="flex-1 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold text-slate-300 transition-all">Close</button>
              <button 
                onClick={() => setIsGpayOpen(true)} 
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-1"
              >
                Secure with <span className="font-black">GPay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isGpayOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end justify-center z-[60]">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 flex flex-col items-center gap-4 animate-slideUp text-black shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 rounded-full mb-2"></div>

            {!isPaying && !paySuccess && (
              <div className="w-full flex flex-col items-center">
                 <div className="font-bold text-xl flex items-center gap-1">
                    <span className="text-blue-600">G</span><span className="text-red-600">o</span><span className="text-yellow-600">o</span><span className="text-blue-600">g</span><span className="text-green-600">l</span><span className="text-red-600">e</span> Pay
                 </div>
                 <p className="text-sm text-gray-500 mt-1">Securing Sale Contract</p>
                 <span className="text-3xl font-black mt-6">₹500.00</span>
                 
                 <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center mt-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">S</div>
                       <div>
                          <p className="text-sm font-bold">State Bank of India</p>
                          <p className="text-xs text-gray-400">•••• 4432</p>
                       </div>
                    </div>
                    <span className="text-blue-600 text-xs font-bold">Change</span>
                 </div>

                 <button 
                    onClick={() => { setIsPaying(true); setTimeout(() => { setPaySuccess(true); }, 2500); }}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    PROCEED TO PAY
                 </button>
              </div>
            )}

            {isPaying && !paySuccess && (
              <div className="flex flex-col items-center p-8">
                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="font-bold mt-4">Processing Payment...</p>
                 <p className="text-xs text-gray-400">Do not refresh or close the page</p>
              </div>
            )}

            {paySuccess && (
              <div className="flex flex-col items-center p-8 w-full">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-scaleUp">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <p className="font-black text-xl mt-4 text-green-600">Payment Successful</p>
                 <p className="text-xs text-gray-500 mt-1">Sale Contract Secured at Indore Mandi</p>
                 
                 <button 
                    onClick={() => { setIsGpayOpen(false); setIsBestMandiModalOpen(false); setIsPaying(false); setPaySuccess(false); }}
                    className="w-full mt-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all"
                  >
                    Back to Dashboard
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}