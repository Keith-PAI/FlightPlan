# FlightPlan Data Layer Design

## Overview

The data layer architecture is designed for aviation-specific requirements including offline capability, data validation, and performance optimization. It implements a multi-tier caching strategy with state management optimized for complex flight planning workflows.

## State Management Architecture

### Primary State Store (Zustand)

```typescript
interface FlightPlanStore {
  // Route State
  routes: {
    active: Route | null
    saved: Route[]
    history: RouteHistoryEntry[]
    isEditing: boolean
    isDirty: boolean
  }

  // Weather State
  weather: {
    reports: Record<string, WeatherReport>
    overlays: WeatherOverlay[]
    lastUpdate: Date | null
    isRefreshing: boolean
    alerts: WeatherAlert[]
  }

  // NOTAM State
  notams: {
    byAirport: Record<string, ParsedNOTAM[]>
    tfrs: TFR[]
    overlays: NOTAMOverlay[]
    lastUpdate: Date | null
    criticalAlerts: CriticalNOTAMAlert[]
  }

  // Aircraft State
  aircraft: {
    profiles: AircraftProfile[]
    selected: AircraftProfile | null
    weightBalance: WeightBalanceResult | null
    performance: PerformanceResult | null
  }

  // UI State
  ui: {
    theme: 'light' | 'dark' | 'night'
    sidebarOpen: boolean
    activePanel: PanelType
    mapSettings: MapSettings
    preferences: UserPreferences
  }

  // System State
  system: {
    online: boolean
    apiStatus: Record<string, APIStatus>
    errors: SystemError[]
    performance: PerformanceMetrics
  }
}
```

### State Slices Implementation

```typescript
// Route Management Slice
interface RouteSlice {
  // State
  active: Route | null
  saved: Route[]
  history: RouteHistoryEntry[]
  isEditing: boolean
  isDirty: boolean

  // Actions
  createRoute: (waypoints: Waypoint[]) => Promise<void>
  loadRoute: (routeId: string) => Promise<void>
  saveRoute: (route?: Route) => Promise<void>
  updateRoute: (updates: Partial<Route>) => void
  deleteRoute: (routeId: string) => Promise<void>
  
  // Waypoint Management
  addWaypoint: (waypoint: Waypoint, index?: number) => void
  removeWaypoint: (waypointId: string) => void
  moveWaypoint: (waypointId: string, newIndex: number) => void
  updateWaypoint: (waypointId: string, updates: Partial<Waypoint>) => void
  
  // Route History
  undo: () => void
  redo: () => void
  clearHistory: () => void
  
  // Validation
  validateRoute: () => Promise<ValidationResult>
  calculateRoute: () => Promise<RouteCalculations>
}

// Weather Management Slice
interface WeatherSlice {
  // State
  reports: Record<string, WeatherReport>
  overlays: WeatherOverlay[]
  lastUpdate: Date | null
  isRefreshing: boolean
  alerts: WeatherAlert[]

  // Actions
  refreshWeather: (airports?: string[]) => Promise<void>
  addWeatherOverlay: (overlay: WeatherOverlay) => void
  removeWeatherOverlay: (overlayId: string) => void
  toggleWeatherOverlay: (overlayId: string) => void
  
  // Data Retrieval
  getWeatherForAirport: (airport: string) => WeatherReport | null
  getWindsAloft: (coordinates: LatLng[], altitudes: number[]) => Promise<WindsData[]>
  
  // Alerts
  checkWeatherAlerts: (route: Route) => WeatherAlert[]
  dismissAlert: (alertId: string) => void
}

// NOTAM Management Slice
interface NOTAMSlice {
  // State
  byAirport: Record<string, ParsedNOTAM[]>
  tfrs: TFR[]
  overlays: NOTAMOverlay[]
  lastUpdate: Date | null
  criticalAlerts: CriticalNOTAMAlert[]

  // Actions
  refreshNOTAMs: (airports?: string[]) => Promise<void>
  addNOTAMOverlay: (overlay: NOTAMOverlay) => void
  removeNOTAMOverlay: (overlayId: string) => void
  
  // Processing
  parseNOTAM: (rawNotam: string) => Promise<ParsedNOTAM>
  categorizeNOTAM: (notam: ParsedNOTAM) => NOTAMCategory
  generateOverlay: (notam: ParsedNOTAM) => Promise<NOTAMOverlay>
  
  // Alerts
  checkCriticalNOTAMs: (route: Route) => CriticalNOTAMAlert[]
  dismissCriticalAlert: (alertId: string) => void
}
```

## Data Persistence Strategy

### Multi-Layer Storage Architecture

```typescript
interface StorageLayer {
  // Memory Cache (Zustand Store)
  memory: {
    priority: 'highest'
    ttl: 'session'
    capacity: 'unlimited'
    use: 'active data, UI state'
  }

  // Session Storage
  session: {
    priority: 'high'
    ttl: 'session'
    capacity: '5MB'
    use: 'temporary route data, form state'
  }

  // Local Storage  
  local: {
    priority: 'medium'
    ttl: 'persistent'
    capacity: '10MB'
    use: 'user preferences, aircraft profiles'
  }

  // IndexedDB
  indexedDB: {
    priority: 'medium'
    ttl: 'persistent'
    capacity: '50MB+'
    use: 'route history, cached API responses'
  }

  // Service Worker Cache
  swCache: {
    priority: 'low'
    ttl: 'configurable'
    capacity: '100MB+'
    use: 'chart tiles, static assets, offline data'
  }
}
```

### Data Persistence Implementation

```typescript
// Persistent Store Configuration
interface PersistentStoreConfig {
  // What to persist
  whitelist: string[]
  // Storage engines by priority
  storage: StorageEngine[]
  // Serialization strategy
  serialization: SerializationConfig
  // Migration strategy
  migrations: MigrationConfig
}

// Storage Engine Interface
interface StorageEngine {
  name: string
  read<T>(key: string): Promise<T | null>
  write<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  size(): Promise<number>
}

// Implementation for different storage types
class LocalStorageEngine implements StorageEngine {
  async read<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  async write<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }

  async size(): Promise<number> {
    return JSON.stringify(localStorage).length
  }
}

class IndexedDBEngine implements StorageEngine {
  private db: IDBDatabase | null = null

  constructor(private dbName: string, private version: number) {}

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        this.createObjectStores()
      }
    })
  }

  private createObjectStores(): void {
    if (!this.db) return

    // Routes store
    if (!this.db.objectStoreNames.contains('routes')) {
      const routeStore = this.db.createObjectStore('routes', { keyPath: 'id' })
      routeStore.createIndex('createdAt', 'createdAt')
      routeStore.createIndex('updatedAt', 'updatedAt')
    }

    // Weather store
    if (!this.db.objectStoreNames.contains('weather')) {
      const weatherStore = this.db.createObjectStore('weather', { keyPath: 'id' })
      weatherStore.createIndex('airport', 'airport')
      weatherStore.createIndex('timestamp', 'timestamp')
    }

    // NOTAM store
    if (!this.db.objectStoreNames.contains('notams')) {
      const notamStore = this.db.createObjectStore('notams', { keyPath: 'id' })
      notamStore.createIndex('airport', 'airport')
      notamStore.createIndex('effectiveFrom', 'effectiveFrom')
    }

    // Aircraft profiles store
    if (!this.db.objectStoreNames.contains('aircraft')) {
      const aircraftStore = this.db.createObjectStore('aircraft', { keyPath: 'id' })
      routeStore.createIndex('name', 'name')
    }
  }

  async read<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['routes', 'weather', 'notams', 'aircraft'], 'readonly')
      const store = transaction.objectStore('routes') // Dynamic store selection needed
      const request = store.get(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  // ... other methods
}
```

## Caching Strategy

### API Response Caching

```typescript
interface CacheStrategy {
  // Weather Data Caching
  weather: {
    metar: { ttl: 60 * 60 * 1000, staleWhileRevalidate: true }      // 1 hour
    taf: { ttl: 6 * 60 * 60 * 1000, staleWhileRevalidate: true }    // 6 hours
    radar: { ttl: 10 * 60 * 1000, staleWhileRevalidate: false }     // 10 minutes
    winds: { ttl: 3 * 60 * 60 * 1000, staleWhileRevalidate: true }  // 3 hours
  }

  // NOTAM Caching
  notams: {
    airport: { ttl: 30 * 60 * 1000, staleWhileRevalidate: true }    // 30 minutes
    tfr: { ttl: 60 * 60 * 1000, staleWhileRevalidate: true }        // 1 hour
  }

  // Chart Tiles
  charts: {
    sectional: { ttl: 24 * 60 * 60 * 1000, staleWhileRevalidate: false } // 24 hours
    ifr: { ttl: 24 * 60 * 60 * 1000, staleWhileRevalidate: false }       // 24 hours
  }

  // Airport Data
  airports: {
    info: { ttl: 7 * 24 * 60 * 60 * 1000, staleWhileRevalidate: true }   // 7 days
    diagrams: { ttl: 30 * 24 * 60 * 60 * 1000, staleWhileRevalidate: false } // 30 days
  }
}

// Cache Implementation
class APICache {
  constructor(
    private storage: StorageEngine,
    private strategies: CacheStrategy
  ) {}

  async get<T>(key: string, category: keyof CacheStrategy): Promise<T | null> {
    const cacheEntry = await this.storage.read<CacheEntry<T>>(`cache:${category}:${key}`)
    
    if (!cacheEntry) return null
    
    const strategy = this.strategies[category]
    const age = Date.now() - cacheEntry.timestamp
    
    // Check if expired
    if (age > strategy.ttl) {
      if (strategy.staleWhileRevalidate) {
        // Return stale data but trigger background refresh
        this.refreshInBackground(key, category)
        return cacheEntry.data
      } else {
        // Remove expired data
        await this.storage.remove(`cache:${category}:${key}`)
        return null
      }
    }
    
    return cacheEntry.data
  }

  async set<T>(key: string, category: keyof CacheStrategy, data: T): Promise<void> {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      category
    }
    
    await this.storage.write(`cache:${category}:${key}`, cacheEntry)
  }

  private async refreshInBackground(key: string, category: keyof CacheStrategy): Promise<void> {
    // Trigger background refresh without blocking
    setTimeout(async () => {
      try {
        // Refresh logic would be implemented here
        console.log(`Background refresh for ${category}:${key}`)
      } catch (error) {
        console.error(`Background refresh failed for ${category}:${key}`, error)
      }
    }, 100)
  }
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  category: string
}
```

## Data Validation & Integrity

### Validation Framework

```typescript
interface ValidationFramework {
  // Route Validation
  route: {
    waypoints: WaypointValidator
    distances: DistanceValidator
    airspace: AirspaceValidator
    fuel: FuelValidator
  }

  // Weather Validation
  weather: {
    currency: CurrencyValidator
    format: FormatValidator
    source: SourceValidator
  }

  // Aircraft Validation
  aircraft: {
    weightBalance: WeightBalanceValidator
    performance: PerformanceValidator
    limits: LimitsValidator
  }
}

// Validation Implementation
abstract class Validator<T> {
  abstract validate(data: T): ValidationResult

  async validateAsync(data: T): Promise<ValidationResult> {
    return this.validate(data)
  }
}

class WaypointValidator extends Validator<Waypoint[]> {
  validate(waypoints: Waypoint[]): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Check minimum waypoints
    if (waypoints.length < 2) {
      errors.push({
        type: 'route',
        code: 'INSUFFICIENT_WAYPOINTS',
        message: 'Route must have at least 2 waypoints',
        severity: 'error'
      })
    }

    // Validate each waypoint
    waypoints.forEach((waypoint, index) => {
      // Check coordinates
      if (!this.isValidCoordinate(waypoint.coordinates)) {
        errors.push({
          type: 'waypoint',
          code: 'INVALID_COORDINATES',
          message: `Invalid coordinates for waypoint ${index + 1}`,
          severity: 'error',
          waypoint: waypoint.id
        })
      }

      // Check identifier format
      if (!this.isValidIdentifier(waypoint.identifier, waypoint.type)) {
        warnings.push({
          type: 'waypoint',
          code: 'INVALID_IDENTIFIER',
          message: `Waypoint identifier "${waypoint.identifier}" may not be valid`,
          severity: 'warning',
          waypoint: waypoint.id
        })
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  private isValidCoordinate(coord: LatLng): boolean {
    return coord.lat >= -90 && coord.lat <= 90 && 
           coord.lng >= -180 && coord.lng <= 180
  }

  private isValidIdentifier(identifier: string, type: WaypointType): boolean {
    switch (type) {
      case 'airport':
        return /^[A-Z0-9]{3,4}$/.test(identifier)
      case 'vor':
        return /^[A-Z]{3}$/.test(identifier)
      case 'ndb':
        return /^[A-Z]{1,3}$/.test(identifier)
      case 'intersection':
        return /^[A-Z]{5}$/.test(identifier)
      default:
        return true
    }
  }
}
```

## Offline Data Management

### Service Worker Data Strategy

```typescript
interface OfflineDataStrategy {
  // Critical Data (Always Available Offline)
  critical: {
    routes: 'all saved routes'
    aircraft: 'all aircraft profiles'
    preferences: 'user settings'
    charts: 'recently viewed chart tiles'
  }

  // Important Data (Available When Cached)
  important: {
    weather: 'last 24 hours of weather data'
    notams: 'last retrieved NOTAMs'
    airports: 'frequently accessed airport data'
  }

  // Optional Data (Online Only)
  optional: {
    social: 'sharing features'
    export: 'cloud integrations'
    updates: 'real-time data feeds'
  }
}

// Service Worker Implementation
class OfflineDataManager {
  constructor(private cache: Cache) {}

  async getOfflineRoute(routeId: string): Promise<Route | null> {
    try {
      const response = await this.cache.match(`/api/routes/${routeId}`)
      return response ? await response.json() : null
    } catch {
      return null
    }
  }

  async saveForOffline(route: Route): Promise<void> {
    const response = new Response(JSON.stringify(route))
    await this.cache.put(`/api/routes/${route.id}`, response)
  }

  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) return

    // Sync offline changes when connection restored
    const offlineChanges = await this.getOfflineChanges()
    
    for (const change of offlineChanges) {
      try {
        await this.syncChange(change)
        await this.removeOfflineChange(change.id)
      } catch (error) {
        console.error('Sync failed for change:', change.id, error)
      }
    }
  }

  private async getOfflineChanges(): Promise<OfflineChange[]> {
    // Implementation to retrieve offline changes
    return []
  }

  private async syncChange(change: OfflineChange): Promise<void> {
    // Implementation to sync individual change
  }

  private async removeOfflineChange(changeId: string): Promise<void> {
    // Implementation to remove synced change
  }
}
```

## Performance Optimization

### Data Loading Patterns

```typescript
interface DataLoadingPatterns {
  // Lazy Loading
  lazy: {
    charts: 'Load chart tiles as user pans/zooms'
    weather: 'Load weather data for visible airports only'
    notams: 'Load NOTAMs for route airports on demand'
  }

  // Prefetching
  prefetch: {
    route: 'Prefetch data for likely next waypoints'
    weather: 'Prefetch weather for common routes'
    charts: 'Prefetch adjacent chart tiles'
  }

  // Background Loading
  background: {
    updates: 'Update cached data in background'
    sync: 'Sync offline changes when online'
    optimization: 'Precompute route optimizations'
  }
}
```

This data layer design provides a robust foundation for the FlightPlan application with aviation-specific requirements for data integrity, offline capability, and performance optimization.