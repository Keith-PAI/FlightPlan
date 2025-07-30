import React, { useState } from 'react'
import type { MapRef } from 'react-map-gl'
import { 
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MapIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { useStore } from '@store'

interface MapControlsProps {
  mapRef: React.RefObject<MapRef>
  isLoaded: boolean
}

export const MapControls: React.FC<MapControlsProps> = ({
  mapRef,
  isLoaded
}) => {
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const {
    showWeatherOverlay,
    showNOTAMOverlay,
    toggleWeatherOverlay,
    toggleNOTAMOverlay,
    preferences
  } = useStore()

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleCenterUS = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [-98.5795, 39.8283], // Geographic center of US
        zoom: 4,
        duration: 2000
      })
    }
  }

  return (
    <>
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          disabled={!isLoaded}
          className="touch-target bg-white hover:bg-gray-50 border border-gray-300 
                   rounded-md shadow-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Zoom in"
        >
          <MagnifyingGlassPlusIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleZoomOut}
          disabled={!isLoaded}
          className="touch-target bg-white hover:bg-gray-50 border border-gray-300 
                   rounded-md shadow-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Zoom out"
        >
          <MagnifyingGlassMinusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            disabled={!isLoaded}
            className="touch-target bg-white hover:bg-gray-50 border border-gray-300 
                     rounded-md shadow-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle layer panel"
          >
            <MapIcon className="w-5 h-5" />
          </button>

          {/* Layer Panel */}
          {showLayerPanel && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 
                          rounded-md shadow-lg p-3 min-w-48">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Map Layers</h3>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showWeatherOverlay}
                    onChange={toggleWeatherOverlay}
                    className="form-checkbox"
                  />
                  <CloudIcon className="w-4 h-4 ml-2 mr-1" />
                  <span className="text-sm">Weather</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showNOTAMOverlay}
                    onChange={toggleNOTAMOverlay}
                    className="form-checkbox"
                  />
                  <ExclamationTriangleIcon className="w-4 h-4 ml-2 mr-1" />
                  <span className="text-sm">NOTAMs</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleCenterUS}
          disabled={!isLoaded}
          className="touch-target bg-white hover:bg-gray-50 border border-gray-300 
                   rounded-md shadow-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Center on United States"
        >
          🇺🇸
        </button>
      </div>

      {/* Map Status */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>{isLoaded ? 'Map Ready' : 'Loading...'}</span>
          </div>
        </div>
      </div>
    </>
  )
}