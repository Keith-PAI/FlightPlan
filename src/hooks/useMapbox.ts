import { useState, useEffect } from 'react'

interface MapboxState {
  isMapboxAvailable: boolean
  mapboxToken: string | null
  error: string | null
}

/**
 * Hook to manage Mapbox availability and configuration
 */
export const useMapbox = (): MapboxState => {
  const [state, setState] = useState<MapboxState>({
    isMapboxAvailable: false,
    mapboxToken: null,
    error: null
  })

  useEffect(() => {
    const checkMapboxAvailability = () => {
      const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

      if (!token) {
        setState({
          isMapboxAvailable: false,
          mapboxToken: null,
          error: 'Mapbox access token not configured'
        })
        return
      }

      // Validate token format (basic check)
      if (!token.startsWith('pk.')) {
        setState({
          isMapboxAvailable: false,
          mapboxToken: null,
          error: 'Invalid Mapbox token format'
        })
        return
      }

      // Check if we can reach Mapbox API
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`)
        .then(response => {
          if (response.ok) {
            setState({
              isMapboxAvailable: true,
              mapboxToken: token,
              error: null
            })
          } else {
            setState({
              isMapboxAvailable: false,
              mapboxToken: null,
              error: `Mapbox API error: ${response.status}`
            })
          }
        })
        .catch(error => {
          setState({
            isMapboxAvailable: false,
            mapboxToken: null,
            error: `Network error: ${error.message}`
          })
        })
    }

    checkMapboxAvailability()
  }, [])

  return state
}