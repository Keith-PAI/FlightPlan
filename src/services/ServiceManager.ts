import type { BaseService } from './types'

/**
 * Service Manager for coordinating application services
 * Handles initialization, cleanup, and health monitoring
 */
export class ServiceManager {
  private services = new Map<string, BaseService>()
  private initialized = false

  /**
   * Register a service with the manager
   */
  register<T extends BaseService>(name: string, service: T): T {
    this.services.set(name, service)
    return service
  }

  /**
   * Get a registered service by name
   */
  get<T extends BaseService>(name: string): T | undefined {
    return this.services.get(name) as T
  }

  /**
   * Initialize all registered services
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    console.log('Initializing services...')
    
    const initPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          await service.initialize()
          console.log(`✅ ${name} service initialized`)
        } catch (error) {
          console.error(`❌ Failed to initialize ${name} service:`, error)
          throw new Error(`Service initialization failed: ${name}`)
        }
      }
    )

    await Promise.all(initPromises)
    this.initialized = true
    console.log('🚀 All services initialized successfully')
  }

  /**
   * Cleanup all services
   */
  async cleanup(): Promise<void> {
    console.log('Cleaning up services...')
    
    const cleanupPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          service.cleanup()
          console.log(`✅ ${name} service cleaned up`)
        } catch (error) {
          console.error(`❌ Failed to cleanup ${name} service:`, error)
        }
      }
    )

    await Promise.allSettled(cleanupPromises)
    this.initialized = false
    console.log('🧹 Service cleanup completed')
  }

  /**
   * Get health status of all services
   */
  getHealthStatus(): Record<string, any> {
    const status: Record<string, any> = {}
    
    this.services.forEach((service, name) => {
      try {
        status[name] = service.getStatus()
      } catch (error) {
        status[name] = {
          healthy: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    return status
  }

  /**
   * Check if all services are healthy
   */
  isHealthy(): boolean {
    const status = this.getHealthStatus()
    return Object.values(status).every(s => s.healthy)
  }

  /**
   * Get list of registered service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Check if services are initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }
}