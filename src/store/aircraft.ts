import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { aircraftService } from '@services'
import type { AircraftState, AircraftActions } from './types'
import type { AircraftProfile } from '@types'

export const useAircraftStore = create<AircraftState & AircraftActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        aircraft: [],
        isLoadingAircraft: false,
        aircraftError: null,
        
        // Actions
        loadAircraft: async () => {
          set(state => {
            state.isLoadingAircraft = true
            state.aircraftError = null
          })
          
          try {
            const aircraft = await aircraftService.loadAll()
            set(state => {
              state.aircraft = aircraft
              state.isLoadingAircraft = false
            })
          } catch (error) {
            set(state => {
              state.aircraftError = error instanceof Error ? error.message : 'Failed to load aircraft'
              state.isLoadingAircraft = false
            })
          }
        },
        
        saveAircraft: async (aircraft: AircraftProfile) => {
          try {
            const savedAircraft = await aircraftService.save(aircraft)
            set(state => {
              const existingIndex = state.aircraft.findIndex(a => a.id === aircraft.id)
              if (existingIndex >= 0) {
                state.aircraft[existingIndex] = savedAircraft
              } else {
                state.aircraft.push(savedAircraft)
              }
              state.aircraftError = null
            })
          } catch (error) {
            set(state => {
              state.aircraftError = error instanceof Error ? error.message : 'Failed to save aircraft'
            })
            throw error
          }
        },
        
        deleteAircraft: async (aircraftId: string) => {
          try {
            await aircraftService.delete(aircraftId)
            set(state => {
              state.aircraft = state.aircraft.filter(a => a.id !== aircraftId)
              state.aircraftError = null
            })
          } catch (error) {
            set(state => {
              state.aircraftError = error instanceof Error ? error.message : 'Failed to delete aircraft'
            })
            throw error
          }
        },
        
        duplicateAircraft: async (aircraftId: string) => {
          try {
            const originalAircraft = get().aircraft.find(a => a.id === aircraftId)
            if (!originalAircraft) {
              throw new Error('Aircraft not found')
            }
            
            const duplicatedAircraft = await aircraftService.duplicate(originalAircraft)
            set(state => {
              state.aircraft.push(duplicatedAircraft)
              state.aircraftError = null
            })
            
            return duplicatedAircraft
          } catch (error) {
            set(state => {
              state.aircraftError = error instanceof Error ? error.message : 'Failed to duplicate aircraft'
            })
            throw error
          }
        }
      })),
      {
        name: 'flight-plan-aircraft',
        partialize: (state) => ({
          aircraft: state.aircraft
        })
      }
    ),
    {
      name: 'Aircraft Store'
    }
  )
)