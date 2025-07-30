import React from 'react'
import { MapContainer } from '@components/map/MapContainer'
import { RouteBuilder } from '@components/route/RouteBuilder'
import { useStore } from '@store'
import type { LatLng } from '@types'

export const FlightPlanningPage: React.FC = () => {
  const { setActivePanel } = useStore()

  const handleMapClick = (coordinates: LatLng) => {
    // Handle map clicks for route building
    console.log('Map clicked at:', coordinates)
  }

  const handleMapLoad = () => {
    console.log('Map loaded successfully')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Route builder toolbar */}
      <div className="bg-white border-b border-gray-200 p-2">
        <RouteBuilder />
      </div>

      {/* Map container */}
      <div className="flex-1">
        <MapContainer
          className="w-full h-full"
          onMapClick={handleMapClick}
          onMapLoad={handleMapLoad}
        />
      </div>
    </div>
  )
}