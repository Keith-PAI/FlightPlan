import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { weatherService } from '@services'
import type { WeatherState, WeatherActions } from './types'
import type { WeatherReport } from '@types'

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      weatherReports: {},
      isLoadingWeather: false,
      weatherError: null,
      lastWeatherUpdate: null,
      
      // Actions
      loadWeather: async (airports: string[]) => {
        if (airports.length === 0) return
        
        set(state => {
          state.isLoadingWeather = true
          state.weatherError = null
        })
        
        try {
          const reports = await weatherService.getCurrentWeather(airports)
          set(state => {
            // Update weather reports
            reports.forEach(report => {
              state.weatherReports[report.airport] = report
            })
            state.isLoadingWeather = false
            state.lastWeatherUpdate = new Date()
          })
        } catch (error) {
          set(state => {
            state.weatherError = error instanceof Error ? error.message : 'Failed to load weather'
            state.isLoadingWeather = false
          })
        }
      },
      
      refreshWeather: async () => {
        const currentAirports = Object.keys(get().weatherReports)
        if (currentAirports.length > 0) {
          await get().loadWeather(currentAirports)
        }
      },
      
      clearWeather: () => {
        set(state => {
          state.weatherReports = {}
          state.weatherError = null
          state.lastWeatherUpdate = null
        })
      }
    })),
    {
      name: 'Weather Store'
    }
  )
)