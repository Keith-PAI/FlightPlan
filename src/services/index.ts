// Service manager and exports
import { ServiceManager } from './ServiceManager'
import { WeatherService } from './api/weatherService'
import { NOTAMService } from './api/notamService' 
import { RouteService } from './routeService'
import { AircraftService } from './aircraftService'
import { ChartService } from './api/chartService'

// Create service instances
export const weatherService = new WeatherService()
export const notamService = new NOTAMService()
export const routeService = new RouteService()
export const aircraftService = new AircraftService()
export const chartService = new ChartService()

// Create and configure service manager
export const serviceManager = new ServiceManager()

// Register services
serviceManager.register('weather', weatherService)
serviceManager.register('notam', notamService)
serviceManager.register('route', routeService)
serviceManager.register('aircraft', aircraftService)
serviceManager.register('chart', chartService)

// Export services and types
export * from './types'