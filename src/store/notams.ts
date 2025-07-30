import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { notamService } from '@services'
import type { NOTAMState, NOTAMActions } from './types'
import type { NOTAM } from '@types'

export const useNOTAMStore = create<NOTAMState & NOTAMActions>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      notams: {},
      isLoadingNOTAMs: false,
      notamError: null,
      lastNOTAMUpdate: null,
      
      // Actions
      loadNOTAMs: async (airports: string[]) => {
        if (airports.length === 0) return
        
        set(state => {
          state.isLoadingNOTAMs = true
          state.notamError = null
        })
        
        try {
          const notams = await notamService.getNOTAMs(airports)
          set(state => {
            // Group NOTAMs by airport
            const notamsByAirport: Record<string, NOTAM[]> = {}
            
            notams.forEach(notam => {
              if (!notamsByAirport[notam.airport]) {
                notamsByAirport[notam.airport] = []
              }
              notamsByAirport[notam.airport].push(notam)
            })
            
            // Update NOTAM store
            Object.entries(notamsByAirport).forEach(([airport, airportNotams]) => {
              state.notams[airport] = airportNotams
            })
            
            state.isLoadingNOTAMs = false
            state.lastNOTAMUpdate = new Date()
          })
        } catch (error) {
          set(state => {
            state.notamError = error instanceof Error ? error.message : 'Failed to load NOTAMs'
            state.isLoadingNOTAMs = false
          })
        }
      },
      
      refreshNOTAMs: async () => {
        const currentAirports = Object.keys(get().notams)
        if (currentAirports.length > 0) {
          await get().loadNOTAMs(currentAirports)
        }
      },
      
      clearNOTAMs: () => {
        set(state => {
          state.notams = {}
          state.notamError = null
          state.lastNOTAMUpdate = null
        })
      }
    })),
    {
      name: 'NOTAM Store'
    }
  )
)