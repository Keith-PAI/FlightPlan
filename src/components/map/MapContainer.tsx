import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Map, Source, Layer } from 'react-map-gl'
import type { MapRef, ViewState } from 'react-map-gl'
import { useStore } from '@store'
import { MapControls } from './MapControls'
import { WeatherOverlay } from './overlays/WeatherOverlay'
import { NOTAMOverlay } from './overlays/NOTAMOverlay'
import { RouteOverlay } from './overlays/RouteOverlay'
import { useMapbox } from '@hooks/useMapbox'
import type { LatLng } from '@types'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapContainerProps {
  className?: string
  onMapClick?: (coordinates: LatLng) => void
  onMapLoad?: () => void
}

export const MapContainer: React.FC<MapContainerProps> = ({
  className = '',
  onMapClick,
  onMapLoad
}) => {
  const mapRef = useRef<MapRef>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { 
    mapViewport, 
    setMapViewport,
    showWeatherOverlay,
    showNOTAMOverlay,
    activeRoute,
    preferences 
  } = useStore()

  // Initialize Mapbox
  const { isMapboxAvailable, mapboxToken } = useMapbox()

  // Handle viewport changes
  const handleViewStateChange = useCallback(
    (evt: { viewState: ViewState }) => {
      const { longitude, latitude, zoom } = evt.viewState
      setMapViewport({
        center: { lat: latitude, lng: longitude },
        zoom
      })
    },
    [setMapViewport]
  )

  // Handle map clicks
  const handleMapClick = useCallback(
    (evt: any) => {
      if (onMapClick) {
        const { lng, lat } = evt.lngLat
        onMapClick({ lat, lng })
      }
    },
    [onMapClick]
  )

  // Handle map load
  const handleMapLoad = useCallback(() => {
    setIsLoaded(true)
    onMapLoad?.()
  }, [onMapLoad])

  // Handle map errors
  const handleMapError = useCallback((error: any) => {
    console.error('Map error:', error)
  }, [])

  // Map style based on preferences
  const mapStyle = React.useMemo(() => {
    switch (preferences.theme) {
      case 'dark':
        return 'mapbox://styles/mapbox/dark-v10'
      case 'night':
        return 'mapbox://styles/mapbox/dark-v10' // Could be customized for red-light
      default:
        return 'mapbox://styles/mapbox/satellite-streets-v11'
    }
  }, [preferences.theme])

  // Fallback if Mapbox is not available
  if (!isMapboxAvailable || !mapboxToken) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Map Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            Mapbox token not configured or service unavailable
          </p>
          <p className="text-sm text-gray-500">
            Falling back to chart overlay mode...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        ref={mapRef}
        longitude={mapViewport.center.lng}
        latitude={mapViewport.center.lat}
        zoom={mapViewport.zoom}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
        onMove={handleViewStateChange}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
        onError={handleMapError}
        interactiveLayerIds={[]}
        cursor="crosshair"
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Chart overlays */}
        <Source
          id="sectional-charts"
          type="raster"
          tiles={[
            `${import.meta.env.VITE_CHART_TILE_SERVER || 'https://charts.example.com'}/sectional/{z}/{x}/{y}.png`
          ]}
          tileSize={256}
        >
          <Layer
            id="sectional-layer"
            type="raster"
            paint={{
              'raster-opacity': 0.7
            }}
          />
        </Source>

        {/* Route overlay */}
        {activeRoute && (
          <RouteOverlay 
            route={activeRoute}
            interactive={true}
          />
        )}

        {/* Weather overlay */}
        {showWeatherOverlay && isLoaded && (
          <WeatherOverlay />
        )}

        {/* NOTAM overlay */}
        {showNOTAMOverlay && isLoaded && (
          <NOTAMOverlay />
        )}
      </Map>

      {/* Map controls */}
      <MapControls 
        mapRef={mapRef}
        isLoaded={isLoaded}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🛩️</div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}