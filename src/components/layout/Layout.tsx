import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useStore } from '@store'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { activePanel } = useStore()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - conditionally shown */}
        {activePanel && (
          <Sidebar />
        )}
        
        {/* Main content */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  )
}