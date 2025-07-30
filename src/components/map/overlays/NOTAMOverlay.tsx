import React from 'react'
import { Source, Layer } from 'react-map-gl'

export const NOTAMOverlay: React.FC = () => {
  // Placeholder NOTAM overlay
  // In full implementation, this would show:
  // - NOTAM markers with severity colors
  // - TFR polygons
  // - Restricted airspace boundaries
  // - Temporary obstacles

  return (
    <>
      {/* Example NOTAM layer - replace with actual NOTAM data */}
      <Source
        id="notam-data"
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: []
        }}
      >
        <Layer
          id="notam-layer"
          type="circle"
          paint={{
            'circle-radius': 5,
            'circle-color': '#ff6600',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1
          }}
        />
      </Source>
    </>
  )
}