import React, { useState } from 'react'
import { PlusIcon, PlayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@components/common'
import { useStore } from '@store'

export const RouteBuilder: React.FC = () => {
  const [departureAirport, setDepartureAirport] = useState('')
  const [destinationAirport, setDestinationAirport] = useState('')
  const { activeRoute, setActiveRoute } = useStore()

  const handleCreateRoute = () => {
    if (!departureAirport || !destinationAirport) return

    // This will be implemented with proper route creation logic
    console.log('Creating route:', { departureAirport, destinationAirport })
  }

  const handleLoadExample = () => {
    setDepartureAirport('KORD')
    setDestinationAirport('KMDW')
  }

  return (
    <div className="flex items-center gap-4">
      {/* Route inputs */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="DEPARTURE"
          value={departureAirport}
          onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
          className="aviation-identifier form-input w-24 text-center"
          maxLength={4}
        />
        <span className="text-gray-400">→</span>
        <input
          type="text"
          placeholder="DESTINATION"
          value={destinationAirport}
          onChange={(e) => setDestinationAirport(e.target.value.toUpperCase())}
          className="aviation-identifier form-input w-24 text-center"
          maxLength={4}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleCreateRoute}
          disabled={!departureAirport || !destinationAirport}
          leftIcon={<PlusIcon className="w-4 h-4" />}
          size="sm"
        >
          Create Route
        </Button>

        <Button
          onClick={handleLoadExample}
          variant="outline"
          size="sm"
          leftIcon={<PlayIcon className="w-4 h-4" />}
        >
          Example
        </Button>

        {activeRoute && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DocumentArrowDownIcon className="w-4 h-4" />}
          >
            Export
          </Button>
        )}
      </div>

      {/* Route status */}
      {activeRoute && (
        <div className="ml-auto text-sm text-gray-600">
          <span className="font-medium">{activeRoute.name}</span>
          <span className="ml-2">
            {activeRoute.totalDistance.toFixed(1)} NM • {Math.round(activeRoute.totalTime)} min
          </span>
        </div>
      )}
    </div>
  )
}