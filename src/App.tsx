import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import { serviceManager } from './services'
import { Layout } from './components/layout'
import { FlightPlanningPage } from './pages/FlightPlanningPage'
import { WeatherPage } from './pages/WeatherPage'
import { NOTAMPage } from './pages/NOTAMPage'
import { AircraftPage } from './pages/AircraftPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoadingScreen } from './components/common'

function App() {
  const { 
    isLoading, 
    error, 
    initializeApp, 
    setError 
  } = useStore()

  useEffect(() => {
    const initialize = async () => {
      try {
        await serviceManager.initialize()
        initializeApp()
      } catch (error) {
        console.error('Failed to initialize application:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize application')
      }
    }

    initialize()

    // Cleanup on unmount
    return () => {
      serviceManager.cleanup().catch(console.error)
    }
  }, [initializeApp, setError])

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen message="Initializing FlightPlan..." />
  }

  // Show error if initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Application Error
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        {/* Default route - redirect to flight planning */}
        <Route path="/" element={<Navigate to="/plan" replace />} />
        
        {/* Main application routes */}
        <Route path="/plan" element={<FlightPlanningPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/notams" element={<NOTAMPage />} />
        <Route path="/aircraft" element={<AircraftPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/plan" replace />} />
      </Routes>
    </Layout>
  )
}

export default App