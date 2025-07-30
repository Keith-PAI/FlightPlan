// Common types used throughout the application

export interface LatLng {
  lat: number
  lng: number
}

export interface LatLngBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapViewport {
  center: LatLng
  zoom: number
  bounds?: LatLngBounds
}

export type FlightConditions = 'VFR' | 'MVFR' | 'IFR' | 'LIFR'

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export interface TimeRange {
  start: Date
  end?: Date
}

export interface ServiceStatus {
  healthy: boolean
  lastUpdate?: Date
  errorCount: number
  responseTime?: number
}

export interface APIError {
  message: string
  status?: number
  code?: string
  details?: Record<string, any>
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// Measurement units
export type DistanceUnit = 'nm' | 'sm' | 'km'
export type SpeedUnit = 'kts' | 'mph' | 'kmh'
export type AltitudeUnit = 'ft' | 'm'
export type WeightUnit = 'lbs' | 'kg'
export type FuelUnit = 'gal' | 'lbs' | 'kg' | 'l'

export interface UserPreferences {
  units: {
    distance: DistanceUnit
    speed: SpeedUnit
    altitude: AltitudeUnit
    weight: WeightUnit
    fuel: FuelUnit
  }
  theme: 'light' | 'dark' | 'night'
  defaultMapLayer: string
  autoSave: boolean
  notifications: boolean
}