# FlightPlan Component Architecture

## Overview

The FlightPlan application follows a modular, service-oriented component architecture designed for aviation-specific requirements. Each module is self-contained with clear interfaces, enabling parallel development and testing.

## Core Module Structure

```
src/
├── components/              # React UI Components
│   ├── common/             # Shared components
│   ├── map/                # Map-related components
│   ├── weather/            # Weather display components
│   ├── route/              # Route planning components
│   ├── aircraft/           # Aircraft management components
│   └── export/             # Data export components
├── services/               # Business logic services
│   ├── route/              # Route management
│   ├── weather/            # Weather data integration
│   ├── notam/              # NOTAM processing
│   ├── airport/            # Airport information
│   ├── aircraft/           # Aircraft profiles
│   └── export/             # Export functionality
├── utils/                  # Utility functions
│   ├── aviation/           # Aviation calculations
│   ├── geo/                # Geographic utilities
│   ├── validation/         # Input validation
│   └── formatting/         # Data formatting
├── hooks/                  # Custom React hooks
├── store/                  # State management
├── types/                  # TypeScript definitions
└── constants/              # Application constants
```

## Core Services Architecture

### 1. RouteManager Service

**Responsibilities:**
- Interactive route planning and editing
- Waypoint management and validation
- Navigation log calculations
- Route optimization algorithms

```typescript
interface IRouteManager {
  // Route Planning
  createRoute(waypoints: Waypoint[]): Promise<Route>
  updateRoute(routeId: string, updates: Partial<Route>): Promise<Route>
  validateRoute(route: Route): Promise<ValidationResult>
  optimizeRoute(route: Route, criteria: OptimizationCriteria): Promise<Route>

  // Waypoint Management
  addWaypoint(routeId: string, waypoint: Waypoint, index?: number): Promise<Route>
  removeWaypoint(routeId: string, waypointId: string): Promise<Route>
  moveWaypoint(routeId: string, waypointId: string, newIndex: number): Promise<Route>

  // Navigation Calculations
  calculateNavigationLog(route: Route, aircraft: AircraftProfile): Promise<NavigationLog>
  calculateFuelRequirements(route: Route, aircraft: AircraftProfile): Promise<FuelData>
  calculateETAs(route: Route, aircraft: AircraftProfile, winds?: WindData[]): Promise<ETAData>

  // Route Persistence
  saveRoute(route: Route): Promise<void>
  loadRoute(routeId: string): Promise<Route>
  deleteRoute(routeId: string): Promise<void>
  listSavedRoutes(): Promise<RouteSummary[]>
}

interface Route {
  id: string
  name: string
  waypoints: Waypoint[]
  metadata: RouteMetadata
  calculations: RouteCalculations
  createdAt: Date
  updatedAt: Date
}

interface Waypoint {
  id: string
  type: 'airport' | 'vor' | 'ndb' | 'intersection' | 'gps'
  identifier: string
  name: string
  coordinates: LatLng
  altitude?: number
  metadata: WaypointMetadata
}

interface NavigationLog {
  legs: NavigationLeg[]
  totals: NavigationTotals
  alternates: AlternateInfo[]
}

interface NavigationLeg {
  from: Waypoint
  to: Waypoint
  trueCourse: number
  magneticCourse: number
  distance: number
  estimatedTime: number
  fuelBurn: number
  groundSpeed: number
  windCorrection: number
}
```

### 2. WeatherService

**Responsibilities:**
- Multi-source weather data integration
- Real-time weather updates
- Weather overlay rendering
- Official briefing generation

```typescript
interface IWeatherService {
  // Current Weather
  getCurrentWeather(airports: string[]): Promise<WeatherReport[]>
  getMetar(airport: string): Promise<METAR>
  getTaf(airport: string): Promise<TAF>

  // Winds Aloft
  getWindsAloft(coordinates: LatLng[], altitudes: number[]): Promise<WindsData>
  getWindsAloftForRoute(route: Route, altitudes: number[]): Promise<RouteWindsData>

  // Weather Overlays
  getRadarOverlay(bounds: LatLngBounds, time?: Date): Promise<RadarLayer>
  getSatelliteOverlay(bounds: LatLngBounds, time?: Date): Promise<SatelliteLayer>
  getTemperatureOverlay(bounds: LatLngBounds, altitude: number): Promise<TemperatureLayer>

  // Weather Hazards
  getPireps(bounds: LatLngBounds): Promise<PIREP[]>
  getAirmets(bounds: LatLngBounds): Promise<AIRMET[]>
  getSigmets(bounds: LatLngBounds): Promise<SIGMET[]>

  // Official Briefings
  generateStandardBriefing(route: Route): Promise<WeatherBriefing>
  generateAbbreviatedBriefing(route: Route): Promise<WeatherBriefing>
  generateOutlookBriefing(route: Route): Promise<WeatherBriefing>

  // Data Management
  refreshWeatherData(): Promise<void>
  getDataAge(): Promise<DataAge>
  subscribeToUpdates(callback: WeatherUpdateCallback): () => void
}

interface WeatherReport {
  airport: string
  metar: METAR
  taf: TAF
  timestamp: Date
  conditions: WeatherConditions
}

interface METAR {
  raw: string
  parsed: ParsedMETAR
  timestamp: Date
  valid: boolean
}

interface TAF {
  raw: string
  parsed: ParsedTAF
  timestamp: Date
  validFrom: Date
  validTo: Date
}

interface WindsData {
  location: LatLng
  altitude: number
  direction: number
  speed: number
  temperature: number
  timestamp: Date
}
```

### 3. NOTAMService (Critical Differentiator)

**Responsibilities:**
- NOTAM parsing and categorization
- Graphical NOTAM visualization
- TFR processing and display
- Integration with airport diagrams

```typescript
interface INOTAMService {
  // NOTAM Retrieval
  getNotams(airports: string[]): Promise<NOTAM[]>
  getNotamsForRoute(route: Route): Promise<NOTAM[]>
  getTfrs(bounds: LatLngBounds): Promise<TFR[]>

  // NOTAM Processing
  parseNotam(rawNotam: string): Promise<ParsedNOTAM>
  categorizeNotam(notam: ParsedNOTAM): NOTAMCategory
  validateNotamRelevance(notam: ParsedNOTAM, route: Route): boolean

  // Graphical Display
  generateNotamOverlay(notam: ParsedNOTAM): Promise<NOTAMOverlay>
  generateTfrOverlay(tfr: TFR): Promise<TFROverlay>
  generateAirportNotamDisplay(airport: string, notams: ParsedNOTAM[]): Promise<AirportNOTAMDisplay>

  // Integration
  integrateWithAirportDiagram(airport: string, notams: ParsedNOTAM[]): Promise<IntegratedDiagram>
  generateNotamSummary(notams: ParsedNOTAM[]): Promise<NOTAMSummary>

  // Alerts
  checkCriticalNotams(route: Route): Promise<CriticalNOTAMAlert[]>
  subscribeToNotamUpdates(callback: NOTAMUpdateCallback): () => void
}

interface NOTAM {
  id: string
  type: NOTAMType
  airport?: string
  coordinates?: LatLng
  raw: string
  parsed: ParsedNOTAM
  effectiveFrom: Date
  effectiveTo?: Date
  created: Date
  classification: NOTAMClassification
}

interface ParsedNOTAM {
  subject: string
  condition: string
  location: NOTAMLocation
  timeframe: NOTAMTimeframe
  details: NOTAMDetails
  impact: NOTAMImpact
}

interface NOTAMOverlay {
  type: 'circle' | 'polygon' | 'line' | 'point'
  geometry: GeoJSON.Geometry
  style: OverlayStyle
  popup: NOTAMPopup
  zIndex: number
}

interface TFR {
  id: string
  type: TFRType
  geometry: GeoJSON.Polygon
  altitudeMin: number
  altitudeMax: number
  effectiveFrom: Date
  effectiveTo: Date
  description: string
  restrictions: TFRRestriction[]
}
```

### 4. AircraftService

**Responsibilities:**
- Aircraft profile management
- Weight and balance calculations
- Performance calculations
- Profile storage and synchronization

```typescript
interface IAircraftService {
  // Profile Management
  createAircraftProfile(profile: AircraftProfileInput): Promise<AircraftProfile>
  updateAircraftProfile(id: string, updates: Partial<AircraftProfile>): Promise<AircraftProfile>
  deleteAircraftProfile(id: string): Promise<void>
  getAircraftProfile(id: string): Promise<AircraftProfile>
  listAircraftProfiles(): Promise<AircraftProfile[]>

  // Weight and Balance
  calculateWeightAndBalance(profile: AircraftProfile, loading: LoadingData): Promise<WeightBalanceResult>
  validateWeightAndBalance(result: WeightBalanceResult): Promise<ValidationResult>
  generateWeightBalanceReport(result: WeightBalanceResult): Promise<WeightBalanceReport>

  // Performance Calculations
  calculatePerformance(profile: AircraftProfile, conditions: FlightConditions): Promise<PerformanceResult>
  calculateFuelBurn(profile: AircraftProfile, distance: number, conditions: FlightConditions): Promise<FuelBurnResult>
  calculateClimbPerformance(profile: AircraftProfile, conditions: FlightConditions): Promise<ClimbPerformanceResult>

  // Data Import/Export
  importAircraftData(data: AircraftImportData): Promise<AircraftProfile>
  exportAircraftProfile(id: string): Promise<AircraftExportData>
  syncWithManufacturerData(profile: AircraftProfile): Promise<AircraftProfile>
}

interface AircraftProfile {
  id: string
  name: string
  type: string
  manufacturer: string
  model: string
  registration?: string
  
  // Weight and Balance
  emptyWeight: number
  emptyCG: number
  maxGrossWeight: number
  cgLimits: CGEnvelope
  stations: WeightStation[]
  
  // Performance
  cruiseSpeed: number
  fuelBurnRate: number
  fuelCapacity: number
  serviceceiling: number
  takeoffDistance: number
  landingDistance: number
  
  // Custom Performance Profiles
  performanceProfiles: PerformanceProfile[]
  
  metadata: AircraftMetadata
}

interface WeightBalanceResult {
  totalWeight: number
  centerOfGravity: number
  withinLimits: boolean
  stations: StationResult[]
  envelope: CGEnvelopeResult
  warnings: WeightBalanceWarning[]
}

interface PerformanceResult {
  trueAirspeed: number
  groundSpeed: number
  fuelBurnRate: number
  rangeWithReserve: number
  enduranceWithReserve: number
  optimalAltitude: number
  conditions: FlightConditions
}
```

### 5. ExportService

**Responsibilities:**
- Multi-format flight plan export
- EFB integration (ForeFlight, Garmin)
- Social sharing capabilities
- Printing and PDF generation

```typescript
interface IExportService {
  // Flight Plan Export
  exportToForeFlight(route: Route): Promise<string>
  exportToGarmin(route: Route): Promise<string>
  exportToGPX(route: Route): Promise<string>
  exportToKML(route: Route): Promise<string>

  // Panel GPS Export
  exportToGTN(route: Route): Promise<Uint8Array>
  exportToG1000(route: Route): Promise<Uint8Array>
  exportToAvidyne(route: Route): Promise<string>

  // Briefing Export
  exportWeatherBriefing(briefing: WeatherBriefing): Promise<PDFDocument>
  exportNavigationLog(navLog: NavigationLog): Promise<PDFDocument>
  exportWeightBalance(wb: WeightBalanceResult): Promise<PDFDocument>

  // Social Sharing
  shareToReddit(route: Route, options: ShareOptions): Promise<ShareResult>
  shareToFacebook(route: Route, options: ShareOptions): Promise<ShareResult>
  generateShareableLink(route: Route): Promise<string>
  generateRouteImage(route: Route): Promise<Blob>

  // Cloud Integration
  syncWithCloudAhoy(route: Route): Promise<SyncResult>
  exportToGarminConnect(route: Route): Promise<SyncResult>
  integrateWithLogbook(flightData: FlightData): Promise<LogbookEntry>
}
```

## UI Component Architecture

### 1. Map Components

```typescript
// Primary map container
interface MapContainerProps {
  route?: Route
  weatherOverlays?: WeatherOverlay[]
  notamOverlays?: NOTAMOverlay[]
  onRouteChange: (route: Route) => void
  onWaypointSelect: (waypoint: Waypoint) => void
}

// Interactive route editor
interface RouteEditorProps {
  route: Route
  isEditing: boolean
  onWaypointAdd: (waypoint: Waypoint, index?: number) => void
  onWaypointRemove: (waypointId: string) => void
  onWaypointMove: (waypointId: string, position: LatLng) => void
}

// Chart overlay controller
interface ChartOverlayProps {
  chartType: 'sectional' | 'tac' | 'ifr-low' | 'ifr-high'
  opacity: number
  visible: boolean
  onTypeChange: (type: ChartType) => void
}
```

### 2. Weather Components

```typescript
// Weather panel container
interface WeatherPanelProps {
  route: Route
  selectedAirports: string[]
  autoRefresh: boolean
  onAirportSelect: (airport: string) => void
}

// METAR/TAF display
interface WeatherDisplayProps {
  weather: WeatherReport
  showRaw: boolean
  showDecoded: boolean
  highlightHazards: boolean
}

// Weather overlay controls
interface WeatherOverlayControlsProps {
  availableOverlays: WeatherOverlayType[]
  activeOverlays: WeatherOverlayType[]
  onOverlayToggle: (overlay: WeatherOverlayType) => void
  onOpacityChange: (overlay: WeatherOverlayType, opacity: number) => void
}
```

### 3. NOTAM Components

```typescript
// NOTAM display panel
interface NOTAMPanelProps {
  notams: ParsedNOTAM[]
  tfrs: TFR[]
  filterCriteria: NOTAMFilter
  onNotamSelect: (notam: ParsedNOTAM) => void
  onFilterChange: (filter: NOTAMFilter) => void
}

// Graphical NOTAM overlay
interface NOTAMOverlayProps {
  notam: ParsedNOTAM
  airport?: string
  showDetails: boolean
  onDetailsToggle: () => void
}

// TFR visualization
interface TFROverlayProps {
  tfr: TFR
  isActive: boolean
  showDetails: boolean
  onDetailsToggle: () => void
}
```

### 4. Aircraft Components

```typescript
// Aircraft profile selector
interface AircraftSelectorProps {
  profiles: AircraftProfile[]
  selectedProfile?: AircraftProfile
  onProfileSelect: (profile: AircraftProfile) => void
  onProfileCreate: () => void
}

// Weight and balance calculator
interface WeightBalanceCalculatorProps {
  aircraft: AircraftProfile
  loading: LoadingData
  onLoadingChange: (loading: LoadingData) => void
  showEnvelope: boolean
  showWarnings: boolean
}

// Performance calculator
interface PerformanceCalculatorProps {
  aircraft: AircraftProfile
  conditions: FlightConditions
  onConditionsChange: (conditions: FlightConditions) => void
  showOptimization: boolean
}
```

## Event System Architecture

### Global Event Bus

```typescript
interface FlightPlanEventBus {
  // Route Events
  'route:created': { route: Route }
  'route:updated': { route: Route, changes: RouteChange[] }
  'route:deleted': { routeId: string }
  'waypoint:added': { route: Route, waypoint: Waypoint, index: number }
  'waypoint:removed': { route: Route, waypoint: Waypoint }
  'waypoint:moved': { route: Route, waypoint: Waypoint, oldIndex: number, newIndex: number }

  // Weather Events
  'weather:updated': { airports: string[], weather: WeatherReport[] }
  'weather:refresh-started': { timestamp: Date }
  'weather:refresh-completed': { timestamp: Date, success: boolean }
  'weather:alert': { alert: WeatherAlert }

  // NOTAM Events
  'notam:updated': { airports: string[], notams: ParsedNOTAM[] }
  'notam:critical': { notam: ParsedNOTAM, route: Route }
  'tfr:active': { tfr: TFR, route: Route }

  // Aircraft Events
  'aircraft:selected': { profile: AircraftProfile }
  'aircraft:updated': { profile: AircraftProfile }
  'weight-balance:calculated': { result: WeightBalanceResult }
  'performance:calculated': { result: PerformanceResult }

  // System Events
  'app:online': { timestamp: Date }
  'app:offline': { timestamp: Date }
  'api:error': { service: string, error: APIError }
  'export:completed': { format: ExportFormat, success: boolean }
}
```

This component architecture provides a robust foundation for building the FlightPlan application with clear separation of concerns, strong typing, and aviation-specific functionality that meets the needs identified in the pilot community research.