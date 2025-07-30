import type { LatLng, FlightConditions, TimeRange } from './common'

export interface WeatherReport {
  airport: string
  timestamp: Date
  metar?: METARData
  taf?: TAFData
  conditions: FlightConditions
  temperature?: number
  dewpoint?: number
  pressure?: number
  density_altitude?: number
}

export interface METARData {
  raw: string
  parsed: {
    airport: string
    timestamp: Date
    wind: WindData
    visibility: number
    ceiling?: number
    clouds: CloudLayer[]
    temperature: number
    dewpoint: number
    altimeter: number
    conditions: FlightConditions
    precipitation?: PrecipitationType[]
    remarks?: string
  }
}

export interface TAFData {
  raw: string
  parsed: {
    airport: string
    issuedTime: Date
    validPeriod: TimeRange
    forecasts: TAFForecast[]
  }
}

export interface TAFForecast {
  validPeriod: TimeRange
  wind: WindData
  visibility: number
  ceiling?: number
  clouds: CloudLayer[]
  precipitation?: PrecipitationType[]
  changeType?: 'FM' | 'TEMPO' | 'PROB' | 'BECMG'
  probability?: number
}

export interface WindData {
  direction?: number // degrees true
  speed: number // knots
  gust?: number // knots
  variable?: boolean
  variableFrom?: number
  variableTo?: number
}

export interface CloudLayer {
  type: 'SKC' | 'CLR' | 'FEW' | 'SCT' | 'BKN' | 'OVC'
  altitude?: number // feet AGL
  cloudType?: 'CU' | 'CB' | 'TCU'
}

export type PrecipitationType = 'RA' | 'SN' | 'DZ' | 'SG' | 'TS' | 'FG' | 'BR' | 'HZ'

export interface WindsAloftData {
  coordinates: LatLng
  altitudes: WindsAloftLevel[]
  forecastTime: Date
  validPeriod: TimeRange
}

export interface WindsAloftLevel {
  altitude: number // feet MSL
  wind: WindData
  temperature?: number // Celsius
}

export interface PIREP {
  id: string
  location: LatLng
  airport?: string
  timestamp: Date
  aircraft: string
  altitude: number
  reportType: 'UA' | 'UUA' // Routine or Urgent
  conditions: {
    turbulence?: TurbulenceReport
    icing?: IcingReport
    clouds?: PIREPCloudReport
    visibility?: number
    temperature?: number
    wind?: WindData
  }
  remarks: string
}

export interface TurbulenceReport {
  intensity: 'NEG' | 'LGT' | 'MOD' | 'SEV' | 'EXTM'
  type?: 'CAT' | 'CHOP' | 'LLWS'
  frequency?: 'OCNL' | 'INTMT' | 'CONT'
}

export interface IcingReport {
  intensity: 'NEG' | 'TRC' | 'LGT' | 'MOD' | 'SEV'
  type?: 'RIME' | 'CLR' | 'MXD'
}

export interface PIREPCloudReport {
  tops?: number
  bases?: number
  layers: CloudLayer[]
}

export interface WeatherAlert {
  id: string
  type: 'AIRMET' | 'SIGMET' | 'CWA' | 'WS'
  severity: 'advisory' | 'warning' | 'watch'
  phenomenon: string
  area: LatLng[]
  validPeriod: TimeRange
  altitudes?: {
    from: number
    to: number
  }
  description: string
  outlook?: string
}

export interface WeatherRadar {
  timestamp: Date
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  imageUrl: string
  animationUrls?: string[]
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme'
}