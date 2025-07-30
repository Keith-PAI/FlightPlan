import React from 'react'
import { Source, Layer } from 'react-map-gl'
import type { Route } from '@types'

interface RouteOverlayProps {
  route: Route
  interactive?: boolean
}

export const RouteOverlay: React.FC<RouteOverlayProps> = ({
  route,
  interactive = false
}) => {
  // Convert route to GeoJSON
  const routeGeoJSON = React.useMemo(() => {
    if (!route.waypoints.length) {
      return {
        type: 'FeatureCollection' as const,
        features: []
      }
    }

    // Create line string from waypoints
    const coordinates = route.waypoints.map(wp => [wp.coordinates.lng, wp.coordinates.lat])
    
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates
          },
          properties: {
            routeId: route.id,
            routeName: route.name
          }
        },
        // Add waypoint markers
        ...route.waypoints.map(wp => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [wp.coordinates.lng, wp.coordinates.lat]
          },
          properties: {
            waypointId: wp.id,
            identifier: wp.identifier,
            type: wp.type
          }
        }))
      ]
    }
  }, [route])

  return (
    <>
      {/* Route line */}
      <Source
        id={`route-${route.id}`}
        type="geojson"
        data={routeGeoJSON}
      >
        <Layer
          id={`route-line-${route.id}`}
          type="line"
          filter={['==', '$type', 'LineString']}
          paint={{
            'line-color': '#2563eb',
            'line-width': 3,
            'line-opacity': 0.8
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
        />
        
        {/* Waypoint markers */}
        <Layer
          id={`route-waypoints-${route.id}`}
          type="circle"
          filter={['==', '$type', 'Point']}
          paint={{
            'circle-radius': 6,
            'circle-color': '#2563eb',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
          }}
        />
      </Source>
    </>
  )
}