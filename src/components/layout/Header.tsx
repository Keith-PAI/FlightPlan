import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  PaperAirplaneIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { useStore } from '@store'
import { Button } from '@components/common'

export const Header: React.FC = () => {
  const location = useLocation()
  const { activePanel, setActivePanel } = useStore()

  const navigation = [
    { name: 'Plan', href: '/plan', icon: PaperAirplaneIcon },
    { name: 'Weather', href: '/weather', icon: CloudIcon },
    { name: 'NOTAMs', href: '/notams', icon: ExclamationTriangleIcon },
    { name: 'Aircraft', href: '/aircraft', icon: WrenchScrewdriverIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
  ]

  const panelMap: Record<string, typeof activePanel> = {
    '/weather': 'weather',
    '/notams': 'notams',
    '/aircraft': 'aircraft',
    '/settings': 'settings'
  }

  const handleNavClick = (href: string) => {
    const panel = panelMap[href]
    if (panel) {
      setActivePanel(activePanel === panel ? null : panel)
    } else {
      setActivePanel(null)
    }
  }

  return (
    <header className="bg-primary-600 shadow-sm border-b border-primary-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-2xl mr-3">🛩️</div>
            <div>
              <h1 className="text-xl font-bold text-white">FlightPlan</h1>
              <p className="text-xs text-primary-100">PAI Consulting</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            const isPanelActive = activePanel === panelMap[item.href]
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive || isPanelActive
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-100 hover:text-white hover:bg-primary-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-primary-700">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            const isPanelActive = activePanel === panelMap[item.href]
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`
                  flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors
                  ${isActive || isPanelActive
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}