import React from 'react'

export const AircraftPage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Aircraft Management
        </h1>
        <p className="text-gray-600">
          Weight & balance and performance calculations coming in Phase 1
        </p>
      </div>
    </div>
  )
}