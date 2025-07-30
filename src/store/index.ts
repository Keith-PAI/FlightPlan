import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { AppState, AppActions } from './types'

// Combine all store slices
export const useStore = create<AppState & AppActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        isLoading: true,
        error: null,
        isInitialized: false,
        
        // Current selections
        activeRoute: null,
        selectedAirports: [],
        selectedAircraft: null,
        
        // UI state
        activePanel: null,
        mapViewport: {
          center: { lat: 39.8283, lng: -98.5795 }, // Geographic center of US
          zoom: 4
        },
        showWeatherOverlay: true,
        showNOTAMOverlay: true,
        
        // User preferences (persisted)
        preferences: {
          units: {
            distance: 'nm',
            speed: 'kts',
            altitude: 'ft',
            weight: 'lbs',
            fuel: 'gal'
          },
          theme: 'light',
          defaultMapLayer: 'sectional',
          autoSave: true,
          notifications: true
        },
        
        // Actions
        initializeApp: () => set(state => {
          state.isLoading = false
          state.isInitialized = true
        }),
        
        setError: (error: string | null) => set(state => {
          state.error = error
          state.isLoading = false
        }),
        
        setActiveRoute: (route) => set(state => {
          state.activeRoute = route
        }),
        
        setSelectedAirports: (airports) => set(state => {
          state.selectedAirports = airports
        }),
        
        setSelectedAircraft: (aircraft) => set(state => {
          state.selectedAircraft = aircraft
        }),
        
        setActivePanel: (panel) => set(state => {
          state.activePanel = panel
        }),
        
        setMapViewport: (viewport) => set(state => {
          state.mapViewport = { ...state.mapViewport, ...viewport }
        }),
        
        toggleWeatherOverlay: () => set(state => {
          state.showWeatherOverlay = !state.showWeatherOverlay
        }),
        
        toggleNOTAMOverlay: () => set(state => {
          state.showNOTAMOverlay = !state.showNOTAMOverlay
        }),
        
        updatePreferences: (updates) => set(state => {
          state.preferences = { ...state.preferences, ...updates }
        }),
        
        reset: () => set(state => {
          state.activeRoute = null
          state.selectedAirports = []
          state.selectedAircraft = null
          state.activePanel = null
          state.error = null
        })
      })),
      {
        name: 'flight-plan-storage',
        partialize: (state) => ({
          preferences: state.preferences,
          selectedAircraft: state.selectedAircraft,
          mapViewport: state.mapViewport
        })
      }
    ),
    {
      name: 'FlightPlan Store'
    }
  )
)

// Export individual store hooks for better organization
export * from './routes'
export * from './weather'
export * from './notams'
export * from './aircraft'