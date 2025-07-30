import type { 
  Route, 
  WeatherReport, 
  NOTAM, 
  AircraftProfile, 
  UserPreferences,
  MapViewport 
} from '@types'

export type PanelType = 'weather' | 'notams' | 'route' | 'aircraft' | 'settings' | null

export interface AppState {
  // Loading and error states
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  
  // Current selections
  activeRoute: Route | null
  selectedAirports: string[]
  selectedAircraft: AircraftProfile | null
  
  // UI state
  activePanel: PanelType
  mapViewport: MapViewport
  showWeatherOverlay: boolean
  showNOTAMOverlay: boolean
  
  // User preferences (persisted)
  preferences: UserPreferences
}

export interface AppActions {
  // App lifecycle
  initializeApp: () => void
  setError: (error: string | null) => void
  
  // Selection actions
  setActiveRoute: (route: Route | null) => void
  setSelectedAirports: (airports: string[]) => void
  setSelectedAircraft: (aircraft: AircraftProfile | null) => void
  
  // UI actions
  setActivePanel: (panel: PanelType) => void
  setMapViewport: (viewport: Partial<MapViewport>) => void
  toggleWeatherOverlay: () => void
  toggleNOTAMOverlay: () => void
  
  // Preferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  
  // Utilities
  reset: () => void
}

// Route store types
export interface RouteState {
  routes: Route[]
  isLoadingRoutes: boolean
  routeError: string | null
}

export interface RouteActions {
  loadRoutes: () => Promise<void>
  saveRoute: (route: Route) => Promise<void>
  deleteRoute: (routeId: string) => Promise<void>
  duplicateRoute: (routeId: string) => Promise<Route>
  importRoute: (data: string, format: 'fpl' | 'gfp' | 'gpx') => Promise<Route>
  exportRoute: (routeId: string, format: 'fpl' | 'gfp' | 'gpx') => Promise<string>
}

// Weather store types
export interface WeatherState {
  weatherReports: Record<string, WeatherReport>
  isLoadingWeather: boolean
  weatherError: string | null
  lastWeatherUpdate: Date | null
}

export interface WeatherActions {
  loadWeather: (airports: string[]) => Promise<void>
  refreshWeather: () => Promise<void>
  clearWeather: () => void
}

// NOTAM store types
export interface NOTAMState {
  notams: Record<string, NOTAM[]>
  isLoadingNOTAMs: boolean
  notamError: string | null
  lastNOTAMUpdate: Date | null
}

export interface NOTAMActions {
  loadNOTAMs: (airports: string[]) => Promise<void>
  refreshNOTAMs: () => Promise<void>
  clearNOTAMs: () => void
}

// Aircraft store types
export interface AircraftState {
  aircraft: AircraftProfile[]
  isLoadingAircraft: boolean
  aircraftError: string | null
}

export interface AircraftActions {
  loadAircraft: () => Promise<void>
  saveAircraft: (aircraft: AircraftProfile) => Promise<void>
  deleteAircraft: (aircraftId: string) => Promise<void>
  duplicateAircraft: (aircraftId: string) => Promise<AircraftProfile>
}