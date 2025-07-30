import type { LatLng, DistanceUnit, SpeedUnit, AltitudeUnit } from './common'

export interface Waypoint {
  id: string
  type: 'airport' | 'vor' | 'ndb' | 'fix' | 'gps' | 'custom'
  identifier: string
  name?: string
  coordinates: LatLng
  altitude?: number
  frequency?: string
  runway?: string
  notes?: string
}

export interface RouteLeg {
  id: string
  from: Waypoint
  to: Waypoint
  distance: number
  trueCourse: number
  magneticCourse: number
  windCorrection?: number
  groundSpeed?: number
  estimatedTime?: number // minutes
  fuelBurn?: number
  notes?: string
}

export interface Route {
  id: string
  name: string
  description?: string
  waypoints: Waypoint[]
  legs: RouteLeg[]
  totalDistance: number
  totalTime: number // minutes
  totalFuel: number
  cruiseAltitude?: number
  cruiseSpeed?: number
  created: Date
  modified: Date
  createdBy?: string
  isActive: boolean
}

export interface NavigationLog {
  routeId: string
  legs: NavigationLogEntry[]
  summary: {
    totalDistance: number
    totalTime: number
    totalFuel: number
    averageGroundSpeed: number
  }
  weather?: {
    departureWeather: string
    destinationWeather: string
    enrouteWeather?: string[]
  }
  generated: Date
}

export interface NavigationLogEntry {
  legId: string
  waypoint: string
  course: number
  distance: number
  estimatedTime: number
  actualTime?: number
  fuelRemaining: number
  notes?: string
  checkpoints?: {
    time: Date
    position: LatLng
    altitude: number
    groundSpeed: number
  }[]
}

export interface RouteOptimization {
  type: 'fuel' | 'time' | 'weather' | 'terrain'
  originalRoute: Route
  optimizedRoute: Route
  savings: {
    distance?: number
    time?: number
    fuel?: number
  }
  reason: string
}

export interface AlternateAirport {
  airport: Waypoint
  distance: number
  bearing: number
  estimatedTime: number
  fuelRequired: number
  weather?: string
  reason: 'fuel' | 'weather' | 'required' | 'preferred'
}