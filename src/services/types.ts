import type { ServiceStatus } from '@types'

/**
 * Base service interface that all services must implement
 */
export interface BaseService {
  initialize(): Promise<void>
  cleanup(): void
  getStatus(): ServiceStatus
}

/**
 * Service configuration interfaces
 */
export interface ServiceConfig {
  apiTimeout: number
  retryAttempts: number
  cacheTTL: number
  debugMode: boolean
}

export interface APIServiceConfig extends ServiceConfig {
  baseUrl: string
  apiKey?: string
  headers?: Record<string, string>
  rateLimit?: {
    maxRequests: number
    windowMs: number
  }
}

/**
 * Cache interface for services
 */
export interface ServiceCache<T = any> {
  get(key: string): Promise<T | null>
  set(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
}

/**
 * Event bus for service communication
 */
export interface EventBus {
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  emit(event: string, ...args: any[]): void
  removeAllListeners(context?: any): void
}

/**
 * HTTP Client interface
 */
export interface HTTPClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>
  delete<T = any>(url: string, config?: RequestConfig): Promise<T>
  isHealthy(): boolean
  getErrorCount(): number
  initialize(): Promise<void>
  cleanup(): void
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
  retries?: number
}

/**
 * Rate limiter interface
 */
export interface RateLimiter {
  checkLimit(): Promise<void>
  getRemainingRequests(): number
  getResetTime(): Date
  reset(): void
}

/**
 * Circuit breaker interface
 */
export interface CircuitBreaker {
  execute<T>(operation: () => Promise<T>): Promise<T>
  getState(): 'closed' | 'open' | 'half-open'
  getFailureCount(): number
  reset(): void
}

/**
 * Service-specific error types
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public service: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}

export class APIError extends ServiceError {
  constructor(
    message: string,
    service: string,
    public status?: number,
    public response?: any,
    details?: Record<string, any>
  ) {
    super(message, service, `HTTP_${status}`, details)
    this.name = 'APIError'
  }
}

export class ValidationError extends ServiceError {
  constructor(
    message: string,
    service: string,
    public field?: string,
    details?: Record<string, any>
  ) {
    super(message, service, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends ServiceError {
  constructor(
    message: string,
    service: string,
    public originalError?: Error,
    details?: Record<string, any>
  ) {
    super(message, service, 'NETWORK_ERROR', details)
    this.name = 'NetworkError'
  }
}