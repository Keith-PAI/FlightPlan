import type { LatLng, Priority, TimeRange } from './common'

export interface NOTAM {
  id: string
  type: NOTAMType
  airport: string
  raw: string
  parsed: ParsedNOTAM
  effectiveFrom: Date
  effectiveTo?: Date
  created: Date
  classification: NOTAMClassification
  isActive: boolean
}

export type NOTAMType = 
  | 'runway' 
  | 'taxiway' 
  | 'approach' 
  | 'tower' 
  | 'obstacle' 
  | 'airspace' 
  | 'lighting' 
  | 'navaid'
  | 'general'

export interface ParsedNOTAM {
  subject: string
  condition: string
  location: string
  coordinates?: LatLng
  runway?: string
  area?: LatLng[]
  altitude?: {
    from?: number
    to?: number
  }
  schedule?: {
    daily?: TimeRange
    days?: number[] // 0=Sunday, 1=Monday, etc.
    exceptions?: Date[]
  }
}

export interface NOTAMClassification {
  severity: Priority
  category: 'closure' | 'restriction' | 'change' | 'information'
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
  affectedOperations: OperationType[]
}

export type OperationType = 
  | 'takeoff' 
  | 'landing' 
  | 'taxi' 
  | 'approach' 
  | 'departure' 
  | 'enroute'

export interface NOTAMOverlay {
  id: string
  notamId: string
  type: 'polygon' | 'line' | 'circle' | 'marker'
  coordinates: LatLng | LatLng[]
  radius?: number // for circles, in nautical miles
  style: {
    fillColor: string
    strokeColor: string
    fillOpacity: number
    strokeOpacity: number
    strokeWidth: number
    dashArray?: number[]
  }
  popup: {
    title: string
    content: string
    severity: Priority
  }
  visible: boolean
  interactive: boolean
}

export interface TFR {
  id: string
  name: string
  type: 'temporary' | 'standing' | 'published'
  notamNumber?: string
  area: LatLng[]
  altitudes: {
    floor: number // feet MSL
    ceiling: number // feet MSL
  }
  effectiveFrom: Date
  effectiveTo?: Date
  purpose: string
  restrictions: string[]
  controllingAgency: string
  phoneNumber?: string
  isActive: boolean
}

export interface NOTAMFilter {
  types: NOTAMType[]
  severities: Priority[]
  categories: string[]
  dateRange?: TimeRange
  airports?: string[]
  showInactive: boolean
}

export interface NOTAMSummary {
  airport: string
  total: number
  bySeverity: Record<Priority, number>
  byType: Record<NOTAMType, number>
  critical: NOTAM[]
  lastUpdated: Date
}