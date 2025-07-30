import React from 'react'
import { Button } from '@components/common'
import { useStore } from '@store'

export const WeatherPanel: React.FC = () => {
  const { selectedAirports } = useStore()

  return (
    <div className="p-4">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🌤️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Weather Information
        </h3>
        <p className="text-gray-600 mb-4">
          Select airports on the map or create a route to view weather data
        </p>
        <Button variant="outline" size="sm">
          Refresh Weather
        </Button>
      </div>
    </div>
  )
}