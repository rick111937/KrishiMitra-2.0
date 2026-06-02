import React, { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchWeather } from '../api/weatherApi'

export default function WeatherPage() {
  const [forecastData, setForecastData] = useState([])
  const [currentWeather, setCurrentWeather] = useState({ temp: '--', status: 'Loading...', humidity: '--', wind: '--' })

  useEffect(() => {
    fetchWeather().then(res => {
      setForecastData(res.data.forecast || [])
      setCurrentWeather(res.data.current || currentWeather)
    }).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Weather Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time and 7-day extended rainfall predictions.</p>
      </div>

      {/* Current Weather Widget */}
      <div className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/10">
        <div>
          <span className="text-slate-400 text-xs uppercase tracking-wider">Current Conditions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-extrabold">{currentWeather.temp}°C</span>
          </div>
          <p className="text-lg font-semibold text-blue-400 mt-1">{currentWeather.status}</p>
          <p className="text-slate-400 text-xs mt-1">Last updated: Just now</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-xl w-full">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-slate-500 text-xs">Humidity</p>
            <p className="text-lg font-bold">{currentWeather.humidity}%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-slate-500 text-xs">Wind Speed</p>
            <p className="text-lg font-bold">{currentWeather.wind} km/h</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-slate-500 text-xs">Precipitation</p>
            <p className="text-lg font-bold">45%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-slate-500 text-xs">Pressure</p>
            <p className="text-lg font-bold">1012 hPa</p>
          </div>
        </div>
      </div>
      {/* Farming Weather Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-start gap-4 border-l-4 border-green-500">
           <div className="p-3 bg-green-500/10 rounded-xl text-green-400 text-xl">🌱</div>
           <div>
             <h4 className="text-sm font-bold text-white">Sowing Window</h4>
             <p className="text-xs text-slate-300 mt-1">Excellent condition for Sowing.</p>
             <div className="flex items-center gap-1 mt-2">
               <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full font-semibold">Optimal</span>
             </div>
           </div>
        </div>

        <div className={`glass-card p-4 flex items-start gap-4 border-l-4 ${currentWeather.humidity > 70 ? 'border-red-500':'border-yellow-500'}`}>
           <div className="p-3 bg-red-500/10 rounded-xl text-red-400 text-xl">🦠</div>
           <div>
             <h4 className="text-sm font-bold text-white">Pest Spread Index</h4>
             <p className="text-xs text-slate-300 mt-1 text-wrap">{currentWeather.humidity > 70 ? 'High risk due to high humidity.' : 'Minimal spread thresholds.'}</p>
             <div className="flex items-center gap-1 mt-2">
               <span className={`text-[10px] px-2 py-0.5 ${currentWeather.humidity > 70 ? 'bg-red-500/10 text-red-400':'bg-yellow-500/10 text-yellow-500'} rounded-full font-semibold`}>{currentWeather.humidity > 70 ? 'High Risk' : 'Moderate'}</span>
             </div>
           </div>
        </div>

        <div className={`glass-card p-4 flex items-start gap-4 border-l-4 ${currentWeather.wind < 15 ? 'border-green-500':'border-red-500'}`}>
           <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 text-xl">💨</div>
           <div>
             <h4 className="text-sm font-bold text-white">Spraying Suitability</h4>
             <p className="text-xs text-slate-300 mt-1 text-wrap">{currentWeather.wind < 15 ? 'Calm wind. Safe to spray fertilizers.' : 'High winds. Avoid chemical sprays.'}</p>
             <div className="flex items-center gap-1 mt-2">
               <span className={`text-[10px] px-2 py-0.5 ${currentWeather.wind < 15 ? 'bg-green-500/10 text-green-400':'bg-red-500/10 text-red-400'} rounded-full font-semibold`}>{currentWeather.wind < 15 ? 'Favorable' : 'Unfavorable'}</span>
             </div>
           </div>
        </div>
      </div>
      {/* 7-Day Forecast Cards */}
      <div>
        <h3 className="text-lg font-bold mb-3">7-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecastData.map((d, index) => (
            <div key={d.day} className={`glass-card p-4 flex flex-col items-center gap-2 hover:translate-y-[-4px] cursor-pointer ${index === 3 ? 'border-blue-500/30 bg-blue-500/5' : ''}`}>
              <span className="text-sm font-medium text-slate-300">{d.day}</span>
              <div className="w-10 h-10 flex items-center justify-center text-blue-400">
                {d.rain > 30 ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z m0 0l2 2 m1-2l2 2" /></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </div>
              <span className="text-lg font-bold">{d.temp}°</span>
              <div className="flex items-center gap-1 text-blue-400 text-xs">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                <span>{d.rain}mm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-4">Daily Rainfall Predictor</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="rain" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-bold mb-4">Humidity vs Temperature</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <XAxis dataKey="day" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="humidity" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="temp" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}