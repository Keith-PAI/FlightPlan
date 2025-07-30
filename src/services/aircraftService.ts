import type { BaseService, ServiceStatus } from './types'
import type { AircraftProfile } from '@types'
import { nanoid } from 'nanoid'

export class AircraftService implements BaseService {
  private initialized = false
  private aircraft: AircraftProfile[] = []

  async initialize(): Promise<void> {
    console.log('✈️ Initializing Aircraft Service...')
    
    // Load saved aircraft from localStorage
    try {
      const saved = localStorage.getItem('flight-plan-aircraft')
      if (saved) {
        this.aircraft = JSON.parse(saved)
      } else {
        // Load default aircraft profiles
        this.aircraft = this.getDefaultAircraft()
      }
    } catch (error) {
      console.warn('Failed to load saved aircraft:', error)
      this.aircraft = this.getDefaultAircraft()
    }
    
    this.initialized = true
    console.log('✅ Aircraft Service initialized')
  }

  cleanup(): void {
    // Save aircraft to localStorage
    try {
      localStorage.setItem('flight-plan-aircraft', JSON.stringify(this.aircraft))
    } catch (error) {
      console.warn('Failed to save aircraft:', error)
    }
    
    this.initialized = false
    console.log('🧹 Aircraft Service cleaned up')
  }

  getStatus(): ServiceStatus {
    return {
      healthy: this.initialized,
      lastUpdate: new Date(),
      errorCount: 0
    }
  }

  async loadAll(): Promise<AircraftProfile[]> {
    if (!this.initialized) {
      throw new Error('Aircraft service not initialized')
    }

    return [...this.aircraft]
  }

  async save(aircraft: AircraftProfile): Promise<AircraftProfile> {
    if (!this.initialized) {
      throw new Error('Aircraft service not initialized')
    }

    const now = new Date()
    const savedAircraft = {
      ...aircraft,
      id: aircraft.id || nanoid(),
      modified: now,
      created: aircraft.created || now
    }

    const existingIndex = this.aircraft.findIndex(a => a.id === savedAircraft.id)
    if (existingIndex >= 0) {
      this.aircraft[existingIndex] = savedAircraft
    } else {
      this.aircraft.push(savedAircraft)
    }

    return savedAircraft
  }

  async delete(aircraftId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Aircraft service not initialized')
    }

    this.aircraft = this.aircraft.filter(a => a.id !== aircraftId)
  }

  async duplicate(originalAircraft: AircraftProfile): Promise<AircraftProfile> {
    const duplicated: AircraftProfile = {
      ...originalAircraft,
      id: nanoid(),
      name: `${originalAircraft.name} (Copy)`,
      created: new Date(),
      modified: new Date(),
      isDefault: false
    }

    return this.save(duplicated)
  }

  private getDefaultAircraft(): AircraftProfile[] {
    // Placeholder default aircraft - will be expanded in Phase 1
    return []
  }
}