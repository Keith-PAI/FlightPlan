# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a General Aviation Flight Planning Web Application for PAI Consulting, informed by extensive research from Reddit pilot communities (r/flying, r/aviation), pilot forums, and aviation tool reviews. The application is designed as a browser-based, public-use flight planning tool for GA pilots and single-pilot operators in the United States. It will be deployed as a static site on GitHub Pages and embedded in PAI Consulting's Squarespace website via iFrame.

The app aims to differentiate itself by offering clean, uncluttered interface design with features that pilots consistently request but find lacking in existing tools - particularly better NOTAM visualization, simplified UX design, and strong integration capabilities with existing EFB apps like ForeFlight and Garmin Pilot.

## Architecture & Technology Stack

### Frontend Framework
- **Primary**: React or Vue.js (static site build for GitHub Pages deployment)
- **Build Target**: Static site generator optimized for GitHub Pages
- **Deployment**: GitHub Pages with iFrame embedding capability

### Mapping & Visualization
- **Map Engine**: Mapbox GL JS or Leaflet
- **Chart Overlays**: FAA sectional/TAC tile overlays
- **3D Visualization**: WebGL or Cesium.js (Phase 3)

### Data Sources & APIs
- **FAA**: NOTAMs, charts, Chart Supplement database
- **NOAA**: Weather data, winds aloft, NEXRAD radar
- **1800wxbrief/Leidos**: Flight plan filing (Phase 2)
- **AirNav/ForeFlight Directory**: Fuel prices (Phase 2)

### Core Application Structure
The application is organized around these main feature areas based on pilot community research:

#### High-Priority Core Features (MVP Requirements)
1. **Interactive Route Planning Module**
   - VFR sectional and IFR low/high enroute chart overlays
   - Click-and-drag route editing with waypoint support
   - Airports, VORs, GPS coordinates, and navigation aids
   - Digital navigation log with course, distance, heading, ETE, fuel calculations
   - Airspace boundaries and special use airspace display

2. **Comprehensive Weather Integration**
   - Current METARs and TAFs for departure, destination, and alternates
   - NEXRAD radar and satellite imagery overlays  
   - Winds aloft forecasts with graphical display by altitude
   - PIREPs pinned at reported locations with altitude decoding
   - AIRMET/SIGMET displayed as 3D polygons on map
   - Official FAA weather briefing package generation

3. **Enhanced NOTAM & TFR System**
   - Graphical NOTAM visualization (critical differentiator)
   - Closed runways highlighted on airport diagrams
   - TFR polygons with detailed alerts and time restrictions
   - Integration of NOTAMs into taxi diagrams and charts
   - UAV activity areas and obstacle NOTAMs on route display

4. **Advanced Weight & Balance Calculator**
   - Multiple aircraft profile storage and management
   - Real-time CG plotting against envelope diagrams
   - Clear red/green limit indicators
   - Passenger, baggage, and fuel weight calculations

5. **Intelligent Performance Calculator**
   - Aircraft-specific profiles (TAS, fuel burn, climb performance)
   - Automatic performance adjustment for altitude and temperature
   - Wind-corrected leg estimates and fuel planning
   - Multiple cruise profile support without requiring dozens of profiles

6. **Comprehensive Airport Information**
   - FAA Chart Supplement integration
   - Runway data, frequencies, elevation, fuel availability
   - Airport diagrams and approach plate access
   - Traffic pattern information and CTAF frequencies

## Development Commands

Since this is a new project, these commands will be relevant once development begins:

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing & Quality
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (for map interactions)
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

### Deployment
```bash
# Build and deploy to GitHub Pages
npm run deploy

# Build production bundle
npm run build:prod
```

#### Medium-Priority Features (Phase 2 Enhancements)
1. **Fuel Price Integration & Planning**
   - AirNav or ForeFlight Directory fuel price overlays
   - Color-coded fuel price mapping
   - Fuel stop optimization based on price and range
   - Economical fuel stop suggestions along route

2. **Route & Altitude Optimization**
   - Winds aloft analysis for optimal cruise altitude
   - "Fastest altitude" and "fuel saver altitude" recommendations
   - IFR route optimization and expected route suggestions
   - Flight plan audit with optimization recommendations

3. **Export & Integration Capabilities**
   - ForeFlight .fpl format export
   - Garmin .gfp format export
   - GPX format for panel GPS systems
   - Direct integration with 1800wxbrief for flight plan filing

4. **Enhanced Planning Tools**
   - Electronic logbook integration
   - Custom aircraft checklists
   - Terrain alerts and profile view
   - Alternate airport suggestions with weather data
   - Split-screen planning views

#### "Wow Factor" Differentiators (Phase 3)
1. **3D Terrain Visualization**
   - Google Earth-style 3D terrain with sectional overlays
   - Interactive 3D route visualization over terrain
   - Tilt-map capability for terrain awareness

2. **Advanced UI Features**
   - Radial menu system (inspired by Garmin Pilot)
   - Contextual menus for waypoints and airports
   - Progressive disclosure interface design

3. **Integration & Automation**
   - Live ADS-B weather/traffic integration (future PWA)
   - AI-based flight planning suggestions
   - Engine data integration for Garmin-equipped aircraft
   - Social flight planning and route sharing

## Key Development Considerations

### Performance Requirements (Critical Success Factors)
- Sub-3-second load times on 3G networks
- Smooth panning/zooming without lag (60fps target)
- Efficient map tile caching strategy
- Optimized weather API response handling
- Single-pilot operation optimization (minimal head-down time)

### User Experience Design (Based on Pilot Feedback)
- **Simplicity over Feature Overload**: Avoid "25 tiny buttons" approach
- **Progressive Disclosure**: Show primary functions prominently, hide advanced features until needed
- **Touch-Friendly Design**: Large, easily tappable controls for cockpit use
- **Dark Mode/Night Vision**: Red-light compatible theme for night operations
- **Radial/Contextual Menus**: Quick access to common functions
- **Split-Screen Support**: Multiple information panes without constant toggling

### Mobile & Responsive Design
- **Primary Target**: iPad Mini and tablet users
- **Secondary**: Desktop planning with mobile execution
- **Touch Gestures**: Pinch-zoom, drag-and-drop route editing
- **Keyboard Shortcuts**: Desktop efficiency features
- **Cross-Platform**: iOS, Android, desktop browsers

### Data Management & Caching
- **Local Storage**: User preferences and aircraft profiles (Phase 1)
- **API Response Caching**: Minimize external API calls
- **Progressive Web App (PWA)**: Offline capability for cockpit use
- **Chart Tile Optimization**: Efficient sectional/IFR chart loading

### Integration & Interoperability
- **ForeFlight Compatibility**: .fpl export, route string parsing
- **Garmin Ecosystem**: .gfp export, fltplan.com-style workflow
- **Panel GPS Integration**: SD card compatible flight plans
- **iFrame Embedding**: Squarespace 7.1 compatibility
- **Social Integration**: Reddit/Facebook sharing capabilities

## Branding Guidelines

### Color Palette
- **Navy**: #033668 (primary)
- **Light Blue**: #4ab8fd / #2b92f9 (accents)
- **Secondary**: #dcd9e1, #b0e0fe (backgrounds)
- **Base**: #f2f2f2 / #ffffff (backgrounds)

### Assets Location
- Brand kit and logos: `/assets/` directory
- Use PAI Consulting branding consistently across all UI elements

## Phase-Based Development (Community-Driven Roadmap)

### Phase 1 (MVP - Essential Features)
**Goal**: Match core functionality of SkyVector/FltPlan.com with better UX
- Interactive route planning on VFR/IFR charts
- Comprehensive weather briefing (METAR, TAF, radar, winds aloft)
- Enhanced NOTAM/TFR visualization (key differentiator)
- Multi-aircraft weight & balance calculator
- Intelligent aircraft performance calculations
- Airport information and frequency display

### Phase 2 (Enhanced Features - "Nice-to-Haves")
**Goal**: Feature parity with mid-tier ForeFlight/Garmin Pilot features
- Fuel price overlays and stop optimization
- Altitude and route optimization algorithms
- Flight plan export (.fpl, .gfp, GPX formats)
- 1800wxbrief integration for plan filing
- Custom aircraft checklists
- Terrain alerts and alternate planning

### Phase 3 (Wow Factor - Differentiators)
**Goal**: Unique features that generate pilot community buzz
- 3D terrain visualization with sectional overlays
- Radial menu UI system
- AI-powered optimization suggestions
- Live ADS-B integration (PWA version)
- Social flight planning and route sharing
- Garmin avionics data integration

## Testing Strategy (Pilot-Focused)

### Core Functionality Testing
- **Route Planning Accuracy**: Verify distance/bearing calculations against sectional charts
- **Chart Overlay Alignment**: Ensure VFR/IFR charts align properly with underlying maps
- **Weather Data Accuracy**: Cross-reference with official FAA/NOAA sources
- **NOTAM Parsing**: Validate graphical NOTAM display against raw text NOTAMs
- **Weight & Balance Calculations**: Test against manufacturer POH data

### User Experience Testing
- **Touch Gesture Responsiveness**: Test on iPad Mini and common pilot tablets
- **Single-Pilot Usability**: Minimize head-down time in cockpit scenarios
- **Performance Under Load**: Test with multiple weather overlays and complex routes
- **Cross-Browser Compatibility**: Safari (iOS), Chrome, Edge priority
- **Night Mode Testing**: Verify red-light compatibility and readability

### Integration Testing
- **ForeFlight Export**: Verify .fpl files open correctly in ForeFlight
- **Garmin Pilot Export**: Test .gfp file compatibility
- **API Response Handling**: Test weather/NOTAM API failures and fallbacks
- **iFrame Embedding**: Verify functionality within Squarespace environment

### Accessibility & Compliance
- **WCAG 2.1 AA compliance**: Focus on color contrast and navigation
- **Keyboard Navigation**: Essential for desktop planning workflows
- **Aviation-Specific Accessibility**: Consider pilot-specific needs (colorblind-friendly charts)

## Security & Compliance (Aviation-Specific)

### Data Handling & Privacy
- **Phase 1**: No user accounts, local storage only for preferences
- **API Security**: Secure key management for FAA/NOAA weather APIs
- **CORS Configuration**: Proper setup for GitHub Pages and Squarespace embedding
- **No PII Storage**: Avoid storing personally identifiable information

### Aviation Regulatory Compliance
- **Weather Data Currency**: Ensure real-time data and timestamp accuracy
- **NOTAM Display Standards**: Follow FAA formatting requirements
- **Flight Planning Disclaimers**: Clear guidance that app supplements but doesn't replace official briefings
- **Chart Currency**: Verify sectional and IFR chart update cycles
- **API Terms Compliance**: Adhere to FAA and NOAA API usage terms

### Quality Assurance for Safety
- **Data Validation**: Cross-reference calculations with authoritative sources
- **Error Handling**: Graceful degradation when weather/NOTAM services unavailable
- **Version Control**: Track changes to performance calculations and algorithms
- **Pilot Feedback Loop**: Community-driven testing and validation

## Research Sources & Community Validation

This application design is based on extensive research from:
- **Reddit Communities**: r/flying, r/aviation, r/aviationmechanic
- **Pilot Forums**: AOPA, AvWeb discussions
- **Existing Tools Analysis**: ForeFlight, Garmin Pilot, SkyVector, FltPlan.com
- **Feature Requests**: Direct pilot feedback on desired improvements
- **UX Research**: Single-pilot operation requirements and cockpit usability

Key insights driving development priorities:
1. **Graphical NOTAM display** is the most requested missing feature
2. **Simplified UI** preferred over feature-heavy interfaces
3. **Integration capabilities** more important than feature completeness
4. **Performance and reliability** are non-negotiable for cockpit use
5. **Progressive disclosure** essential for reducing cognitive load