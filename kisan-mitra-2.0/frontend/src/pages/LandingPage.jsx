import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Sprout, TrendingUp, AlertTriangle, ArrowRight, Github, Facebook, Twitter } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Background Grid & ambient light */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_40%,black,transparent)]"></div>
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Transparent Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-50 py-4 px-6 backdrop-blur-md border-b border-white/5 bg-[#090d16]/30"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Kisan-Mitra
            </span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/dashboard" className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-semibold tracking-wide transition-all duration-300 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40">
              Launch Dashboard
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 md:pt-32 pb-16"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Your AI-Powered Smart Farming Assistant</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
          Cultivating the Future of <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Smart Agriculture
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mt-4">
          Empower your farm with real-time analytics, AI recommendations, and immersive dashboard experiences tailored for growth.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center pt-8">
          <Link to="/dashboard" className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-bold tracking-wide text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center">
            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold tracking-wide text-lg backdrop-blur-md transition-all duration-300">
            Explore Features
          </button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 pb-24 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-emerald-500/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col items-start h-full"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 text-emerald-400 mb-4 group-hover:scale-110 transition-all duration-300">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">Hyperlocal Weather</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">Precise forecasts and historical data dashboard customized for your coordinates.</p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-teal-500/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col items-start h-full"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-500/5 text-teal-400 mb-4 group-hover:scale-110 transition-all duration-300">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">Soil Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">Monitor NPK values, Moisture levels, and receive dynamic soil health diagnostics.</p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-cyan-500/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col items-start h-full"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 text-cyan-400 mb-4 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">Market Intelligence</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">Real-time crop pricing trends and analytics that keep you ahead of the market.</p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-blue-500/30 backdrop-blur-md hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col items-start h-full"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-400 mb-4 group-hover:scale-110 transition-all duration-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">Crop Risk Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">Aggregated alerts for climate variance and pest management warnings.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats/Metrics Banner */}
      <section className="relative z-10 bg-[#06090f] border-t border-b border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-white">98%</p>
            <p className="text-slate-500 text-xs mt-1">Accuracy Rate</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-teal-400">2K+</p>
            <p className="text-slate-500 text-xs mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400">24/7</p>
            <p className="text-slate-500 text-xs mt-1">AI Monitoring</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">50+</p>
            <p className="text-slate-500 text-xs mt-1">Supported Crops</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#04060b] text-slate-500 py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Kisan-Mitra
            </span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Kisan-Mitra. All rights reserved.</p>
          <div className="flex space-x-5">
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
