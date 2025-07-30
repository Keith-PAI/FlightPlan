// API-related types and interfaces

export interface APIResponse<T = any> {
  data: T
  success: boolean
  message?: string
  timestamp: Date
  errors?: APIError[]
}

export interface APIError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface APIConfig {
  baseUrl: string
  timeout: number
  retries: number
  retryDelay: number
  headers?: Record<string, string>
  apiKey?: string
}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  skipOnError?: boolean
}

export interface CacheConfig {
  enabled: boolean
  ttl: number // milliseconds
  maxSize?: number
  storage?: 'memory' | 'localStorage' | 'indexedDB'
}

// Service-specific API interfaces

export interface WeatherAPIConfig extends APIConfig {
  sources: {
    primary: 'noaa' | 'aviationweather'
    backup: string[]
  }
  cache: {
    metar: CacheConfig
    taf: CacheConfig
    winds: CacheConfig
    radar: CacheConfig
  }
}

export interface NOTAMAPIConfig extends APIConfig {
  parseOptions: {
    enableVisualizations: boolean
    classifyAutomatically: boolean
    filterDuplicates: boolean
  }
  cache: CacheConfig
}

export interface ChartAPIConfig extends APIConfig {
  tileServerUrl: string
  fallbackServers: string[]
  preloadRadius: number // nautical miles
  maxZoomLevel: number
  cache: CacheConfig & {
    preloadEnabled: boolean
    offlineFirst: boolean
  }
}

// HTTP Client types
export interface HTTPClientConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
  interceptors?: {
    request?: RequestInterceptor[]
    response?: ResponseInterceptor[]
  }
  retryConfig?: RetryConfig
}

export interface RequestInterceptor {
  onFulfilled?: (config: any) => any
  onRejected?: (error: any) => any
}

export interface ResponseInterceptor {
  onFulfilled?: (response: any) => any
  onRejected?: (error: any) => any
}

export interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: any) => boolean
  exponentialBackoff?: boolean
  maxDelay?: number
}

// Circuit Breaker types
export interface CircuitBreakerConfig {
  threshold: number
  timeout: number
  monitoringPeriod: number
  resetTimeout: number
}

export type CircuitBreakerState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerStats {
  state: CircuitBreakerState
  failures: number
  successes: number
  lastFailureTime?: Date
  lastSuccessTime?: Date
}

// Health Check types
export interface HealthCheckResult {
  service: string
  healthy: boolean
  responseTime: number
  timestamp: Date
  error?: string
  details?: Record<string, any>
}

export interface SystemHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  services: Record<string, HealthCheckResult>
  lastCheck: Date
}

// Export types
export interface ExportFormat {
  name: string
  extension: string
  mimeType: string
  description: string
  supportsRoutes: boolean
  supportsWeather: boolean
  supportsNOTAMs: boolean
}

export interface ExportOptions {
  format: string
  includeWeather: boolean
  includeNOTAMs: boolean
  includePerformance: boolean
  filename?: string
  customFields?: Record<string, any>
}

export interface ExportResult {
  success: boolean
  filename: string
  url?: string
  data?: string | Blob
  format: string
  size: number
  generated: Date
  error?: string
}

// Social sharing
export interface ShareOptions {
  platform: 'reddit' | 'facebook' | 'twitter' | 'email' | 'link'
  title: string
  description?: string
  includeImage: boolean
  includeRoute: boolean
  includeWeather: boolean
  customMessage?: string
}

export interface ShareResult {
  success: boolean
  url?: string
  platform: string
  error?: string
}