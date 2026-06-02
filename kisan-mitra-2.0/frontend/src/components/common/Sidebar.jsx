import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const links = [
    { title: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { title: 'Weather', path: '/weather', icon: 'weather' },
    { title: 'Soil Analysis', path: '/soil', icon: 'soil' },
    { title: 'Crop Risk', path: '/crop-risk', icon: 'risk' },
    { title: 'Market', path: '/market', icon: 'market' },
    { title: 'Warehouses', path: '/warehouses', icon: 'warehouse' },
    { title: 'Alerts', path: '/alerts', icon: 'alert' }
  ]

  const getIcon = (type) => {
    switch(type) {
      case 'dashboard': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z M14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
      case 'weather': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
      case 'soil': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
      case 'risk': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
      case 'market': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21h8M12 3v18" />
        </svg>
      )
      case 'warehouse': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
      case 'alert': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 8.87v5.288c0 .386-.147.752-.405 1.045L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
      default: return null
    }
  }

  return (
    <aside className="w-64 bg-[#0b0f19]/40 backdrop-blur-md border-r border-white/5 flex flex-col p-4 gap-2 sticky top-[73px] h-[calc(100vh-73px)]">
      {links.map((link) => {
        const isActive = location.pathname === link.path
        return (
          <Link 
            key={link.path} 
            to={link.path} 
            className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            {getIcon(link.icon)}
            <span>{link.title}</span>
          </Link>
        )
      })}
    </aside>
  )
}
