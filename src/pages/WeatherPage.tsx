import React from 'react'

export const WeatherPage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🌤️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Weather Information
        </h1>
        <p className="text-gray-600">
          Comprehensive weather view coming in Phase 1 implementation
        </p>
      </div>
    </div>
  )
}