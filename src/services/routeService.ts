import type { BaseService, ServiceStatus } from './types'
import type { Route } from '@types'
import { nanoid } from 'nanoid'

export class RouteService implements BaseService {
  private initialized = false
  private routes: Route[] = []

  async initialize(): Promise<void> {
    console.log('🛩️ Initializing Route Service...')
    
    // Load saved routes from localStorage
    try {
      const saved = localStorage.getItem('flight-plan-routes')
      if (saved) {
        this.routes = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load saved routes:', error)
    }
    
    this.initialized = true
    console.log('✅ Route Service initialized')
  }

  cleanup(): void {
    // Save routes to localStorage
    try {
      localStorage.setItem('flight-plan-routes', JSON.stringify(this.routes))
    } catch (error) {
      console.warn('Failed to save routes:', error)
    }
    
    this.initialized = false
    console.log('🧹 Route Service cleaned up')
  }

  getStatus(): ServiceStatus {
    return {
      healthy: this.initialized,
      lastUpdate: new Date(),
      errorCount: 0
    }
  }

  async loadAll(): Promise<Route[]> {
    if (!this.initialized) {
      throw new Error('Route service not initialized')
    }

    return [...this.routes]
  }

  async save(route: Route): Promise<Route> {
    if (!this.initialized) {
      throw new Error('Route service not initialized')
    }

    const now = new Date()
    const savedRoute = {
      ...route,
      id: route.id || nanoid(),
      modified: now,
      created: route.created || now
    }

    const existingIndex = this.routes.findIndex(r => r.id === savedRoute.id)
    if (existingIndex >= 0) {
      this.routes[existingIndex] = savedRoute
    } else {
      this.routes.push(savedRoute)
    }

    return savedRoute
  }

  async delete(routeId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Route service not initialized')
    }

    this.routes = this.routes.filter(r => r.id !== routeId)
  }

  async duplicate(originalRoute: Route): Promise<Route> {
    const duplicated: Route = {
      ...originalRoute,
      id: nanoid(),
      name: `${originalRoute.name} (Copy)`,
      created: new Date(),
      modified: new Date(),
      isActive: false
    }

    return this.save(duplicated)
  }

  async import(data: string, format: 'fpl' | 'gfp' | 'gpx'): Promise<Route> {
    // Placeholder for import logic
    console.log('Importing route data:', { format, data: data.substring(0, 100) })
    
    const importedRoute: Route = {
      id: nanoid(),
      name: `Imported Route (${format.toUpperCase()})`,
      waypoints: [],
      legs: [],
      totalDistance: 0,
      totalTime: 0,
      totalFuel: 0,
      created: new Date(),
      modified: new Date(),
      isActive: false
    }

    return this.save(importedRoute)
  }

  async export(route: Route, format: 'fpl' | 'gfp' | 'gpx'): Promise<string> {
    // Placeholder for export logic
    console.log('Exporting route:', route.name, 'as', format)
    
    return `<!-- ${format.toUpperCase()} export for ${route.name} -->\n<!-- Implementation pending -->`
  }
}