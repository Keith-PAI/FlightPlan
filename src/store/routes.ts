import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { routeService } from '@services'
import type { RouteState, RouteActions } from './types'
import type { Route } from '@types'

export const useRouteStore = create<RouteState & RouteActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        routes: [],
        isLoadingRoutes: false,
        routeError: null,
        
        // Actions
        loadRoutes: async () => {
          set(state => {
            state.isLoadingRoutes = true
            state.routeError = null
          })
          
          try {
            const routes = await routeService.loadAll()
            set(state => {
              state.routes = routes
              state.isLoadingRoutes = false
            })
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to load routes'
              state.isLoadingRoutes = false
            })
          }
        },
        
        saveRoute: async (route: Route) => {
          try {
            const savedRoute = await routeService.save(route)
            set(state => {
              const existingIndex = state.routes.findIndex(r => r.id === route.id)
              if (existingIndex >= 0) {
                state.routes[existingIndex] = savedRoute
              } else {
                state.routes.push(savedRoute)
              }
              state.routeError = null
            })
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to save route'
            })
            throw error
          }
        },
        
        deleteRoute: async (routeId: string) => {
          try {
            await routeService.delete(routeId)
            set(state => {
              state.routes = state.routes.filter(r => r.id !== routeId)
              state.routeError = null
            })
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to delete route'
            })
            throw error
          }
        },
        
        duplicateRoute: async (routeId: string) => {
          try {
            const originalRoute = get().routes.find(r => r.id === routeId)
            if (!originalRoute) {
              throw new Error('Route not found')
            }
            
            const duplicatedRoute = await routeService.duplicate(originalRoute)
            set(state => {
              state.routes.push(duplicatedRoute)
              state.routeError = null
            })
            
            return duplicatedRoute
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to duplicate route'
            })
            throw error
          }
        },
        
        importRoute: async (data: string, format: 'fpl' | 'gfp' | 'gpx') => {
          try {
            const importedRoute = await routeService.import(data, format)
            set(state => {
              state.routes.push(importedRoute)
              state.routeError = null
            })
            
            return importedRoute
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to import route'
            })
            throw error
          }
        },
        
        exportRoute: async (routeId: string, format: 'fpl' | 'gfp' | 'gpx') => {
          try {
            const route = get().routes.find(r => r.id === routeId)
            if (!route) {
              throw new Error('Route not found')
            }
            
            const exportedData = await routeService.export(route, format)
            return exportedData
          } catch (error) {
            set(state => {
              state.routeError = error instanceof Error ? error.message : 'Failed to export route'
            })
            throw error
          }
        }
      })),
      {
        name: 'flight-plan-routes',
        partialize: (state) => ({
          routes: state.routes
        })
      }
    ),
    {
      name: 'Route Store'
    }
  )
)