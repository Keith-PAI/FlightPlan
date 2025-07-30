import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingScreenProps {
  message?: string
  showSpinner?: boolean
  className?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showSpinner = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
      <div className="text-center">
        {showSpinner && (
          <div className="mb-4">
            <LoadingSpinner size="large" />
          </div>
        )}
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          FlightPlan
        </h2>
        <p className="text-gray-600">
          {message}
        </p>
      </div>
    </div>
  )
}