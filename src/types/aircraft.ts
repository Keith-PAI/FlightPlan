import type { WeightUnit, FuelUnit, SpeedUnit } from './common'

export interface AircraftProfile {
  id: string
  name: string
  make: string
  model: string
  tailNumber?: string
  type: 'single-engine' | 'multi-engine' | 'turboprop' | 'jet' | 'helicopter'
  
  // Weight & Balance
  weightBalance: WeightBalanceData
  
  // Performance
  performance: PerformanceData
  
  // Systems
  equipment: EquipmentData
  
  // User settings
  isDefault: boolean
  created: Date
  modified: Date
}

export interface WeightBalanceData {
  emptyWeight: number
  emptyWeightArm: number
  emptyWeightMoment: number
  
  maxGrossWeight: number
  
  stations: WeightStation[]
  
  cgLimits: CGEnvelope
  
  fuelCapacity: {
    total: number
    usable: number
    unusable: number
    arm: number
  }
  
  units: {
    weight: WeightUnit
    arm: 'inches' | 'mm'
    moment: 'in-lbs' | 'kg-mm'
  }
}

export interface WeightStation {
  id: string
  name: string
  maxWeight: number
  arm: number
  type: 'pilot' | 'passenger' | 'baggage' | 'fuel' | 'cargo'
  position: number // order for display
}

export interface CGEnvelope {
  points: CGPoint[]
  
  // Alternative limits for different weights
  forwardLimit?: CGLimit[]
  aftLimit?: CGLimit[]
}

export interface CGPoint {
  weight: number
  cgLimit: {
    forward: number
    aft: number
  }
}

export interface CGLimit {
  weight: number
  cgPosition: number
}

export interface LoadingData {
  aircraftId: string
  stations: LoadingStation[]
  fuel: {
    quantity: number
    unit: FuelUnit
  }
  
  // Calculated values
  totalWeight: number
  totalMoment: number
  cgPosition: number
  cgStatus: 'within-limits' | 'forward-limit' | 'aft-limit' | 'over-weight'
  
  calculated: Date
}

export interface LoadingStation {
  stationId: string
  weight: number
  occupants?: number
  description?: string
}

export interface PerformanceData {
  // Basic performance
  cruiseSpeed: {
    altitude: number
    speed: number
    unit: SpeedUnit
    fuelBurn: number // per hour
  }[]
  
  // Takeoff performance
  takeoffDistance: {
    weight: number
    altitude: number
    temperature: number // Celsius
    distance: number // feet
    groundRoll: number // feet
  }[]
  
  // Landing performance  
  landingDistance: {
    weight: number
    altitude: number
    temperature: number // Celsius
    distance: number // feet
    groundRoll: number // feet
  }[]
  
  // Climb performance
  climbRate: {
    weight: number
    altitude: number
    temperature: number // Celsius
    rate: number // feet per minute
  }[]
  
  // Service ceiling
  serviceCeiling: number // feet
  
  // Range
  range: {
    altitude: number
    speed: number
    fuelBurn: number
    range: number // nautical miles
  }[]
}

export interface EquipmentData {
  // Navigation equipment
  navigation: {
    gps: boolean
    vor: boolean
    ndb: boolean
    ils: boolean
    rnav: boolean
    waas: boolean
  }
  
  // Communication
  communication: {
    com1: boolean
    com2: boolean
    transponder: 'none' | 'mode-a' | 'mode-c' | 'mode-s'
    adsb: 'none' | 'out' | 'in-out'
  }
  
  // Instruments
  instruments: {
    attitude: boolean
    heading: boolean
    altimeter: boolean
    airspeed: boolean
    vsi: boolean
    dme: boolean
    autopilot: boolean
    weatherRadar: boolean
    stormscope: boolean
  }
  
  // Equipment suffix for flight planning
  equipmentSuffix: string
}

export interface PerformanceCalculation {
  aircraftId: string
  type: 'takeoff' | 'landing' | 'cruise' | 'climb'
  conditions: {
    weight: number
    altitude: number
    temperature: number
    windComponent?: number
    runwayCondition?: 'dry' | 'wet' | 'snow' | 'ice'
  }
  results: {
    distance?: number
    groundRoll?: number
    rate?: number
    speed?: number
    fuelBurn?: number
    time?: number
  }
  limitations: string[]
  calculated: Date
}

export interface FuelPlanning {
  route: {
    distance: number
    estimatedTime: number // minutes
  }
  
  aircraft: {
    cruiseSpeed: number
    fuelBurn: number // per hour
    capacity: number
    unusable: number
  }
  
  reserves: {
    vfr: number // 30 minutes typical
    ifr: number // 45 minutes typical
    alternate?: number
    additional?: number
  }
  
  calculation: {
    tripFuel: number
    reserveFuel: number
    totalRequired: number
    recommendedLoad: number
    endurance: number // minutes with loaded fuel
  }
}