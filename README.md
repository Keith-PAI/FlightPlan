# FlightPlan ✈️

A modern General Aviation flight planning web application built for PAI Consulting, designed with extensive pilot community research and aviation-specific requirements.

[![Deployment](https://img.shields.io/badge/deployment-github%20pages-blue)](https://keith-pai.github.io/FlightPlan)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🎯 Project Vision

FlightPlan differentiates itself by offering a clean, uncluttered interface with features that pilots consistently request but find lacking in existing tools - particularly **graphical NOTAM visualization**, simplified UX design, and strong integration capabilities with existing EFB apps like ForeFlight and Garmin Pilot.

### Key Differentiators
- **Graphical NOTAM Display** - Visual representation of NOTAMs on airport diagrams (most requested missing feature)
- **Progressive Disclosure UI** - Essential information visible, advanced features organized to reduce cognitive load
- **Single-Pilot Operation** - Optimized for minimal head-down time in cockpit environments
- **EFB Integration** - Native ForeFlight (.fpl) and Garmin (.gfp) export formats
- **Touch-Optimized** - Designed for iPad Mini and tablet use with 48px+ touch targets

## 🏗️ Architecture

Built with modern web technologies and aviation-specific design patterns:

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with aviation design system
- **Mapping**: Mapbox GL JS with Leaflet fallback
- **APIs**: NOAA Weather, FAA NOTAMs, Chart overlays
- **Deployment**: GitHub Pages with PWA support

## 🚀 Development Status

### ✅ Phase 1 Foundation (Current)
- [x] Project infrastructure and build system
- [x] Responsive layout with progressive disclosure UI
- [x] Interactive map with Mapbox integration
- [x] Service-oriented architecture
- [x] State management and persistence
- [x] Aviation-themed design system
- [x] Touch-optimized components

### 🚧 Phase 1 MVP (In Progress)
- [ ] Real-time weather integration (NOAA APIs)
- [ ] Graphical NOTAM visualization
- [ ] Route planning with waypoint management
- [ ] Weight & balance calculator
- [ ] Aircraft performance calculations
- [ ] Comprehensive testing suite

### 🎯 Phase 2 Enhancements
- [ ] Fuel price integration and optimization
- [ ] Route and altitude optimization
- [ ] Flight plan filing (1800wxbrief)
- [ ] Export functionality (.fpl, .gfp, GPX)
- [ ] Custom checklists and procedures

### 💫 Phase 3 Differentiators
- [ ] 3D terrain visualization
- [ ] Radial menu system (Garmin-inspired)
- [ ] AI-powered optimization suggestions
- [ ] Live ADS-B integration
- [ ] Social flight planning features

## 🛠️ Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation
```bash
# Clone repository
git clone https://github.com/Keith-PAI/FlightPlan.git
cd FlightPlan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

### Environment Variables
Create `.env.local` with your API keys:
```bash
# Mapbox (required for mapping)
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Weather APIs
VITE_NOAA_API_KEY=your_noaa_api_key

# FAA APIs
VITE_FAA_API_KEY=your_faa_api_key
```

## 🧭 User Guide

### Core Features

**Flight Planning**
- Enter departure and destination airports
- Interactive route building with drag-and-drop waypoints
- Automatic distance and time calculations
- Real-time weather overlay integration

**Weather Integration**
- Current METARs and TAFs for route airports
- NEXRAD radar overlay on map
- Winds aloft forecasts with altitude selection
- Weather alerts and PIREPs along route

**NOTAM Visualization**
- Graphical representation of NOTAMs on airport diagrams
- Color-coded severity indicators
- TFR polygon overlays with time restrictions
- Integration with route planning

**Aircraft Management**
- Multiple aircraft profile storage
- Weight & balance calculations with CG envelopes
- Performance calculations for takeoff/landing distances
- Fuel planning with reserves

### Interface Overview

**Progressive Disclosure Design**
- **Level 1**: Essential information always visible (route, weather summary, critical NOTAMs)
- **Level 2**: Detailed data accessible with one click (full weather, NOTAM details, nav log)
- **Level 3**: Advanced features in organized menus (optimization, export, settings)

**Touch Optimization**
- Minimum 48px touch targets for all interactive elements
- Gesture support for map navigation
- Swipe gestures for panel management
- Long-press for contextual menus

## 🧪 Testing

### Test Strategy
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Aviation-Specific Testing
- Route calculation accuracy against sectional charts
- Weather data validation with official FAA/NOAA sources
- NOTAM parsing and graphical display validation
- Weight & balance calculations against POH data
- Cross-browser compatibility (Safari iOS priority)

## 📚 Documentation

### Design Documentation
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md) - High-level technical architecture
- [Component Architecture](docs/COMPONENT_ARCHITECTURE.md) - Service interfaces and patterns
- [UI/UX Design System](docs/UI_UX_DESIGN_SYSTEM.md) - Aviation-focused design specifications
- [API Integration](docs/API_INTEGRATION_ARCHITECTURE.md) - External service integration
- [Development Infrastructure](docs/DEVELOPMENT_INFRASTRUCTURE.md) - CI/CD and deployment

### Research Foundation
This application is based on extensive research from:
- **Reddit Communities**: r/flying, r/aviation pilot feedback
- **Pilot Forums**: AOPA, AvWeb feature discussions
- **Existing Tools Analysis**: ForeFlight, Garmin Pilot, SkyVector, FltPlan.com
- **UX Research**: Single-pilot operation requirements and cockpit usability studies

## 🚢 Deployment

### GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy

# Deploy staging
npm run deploy:staging
```

### Environment Setup
- **Production**: Optimized builds with service worker caching
- **Staging**: Pre-production testing environment
- **Development**: Hot reload with debugging tools

### PWA Features
- Offline functionality for essential features
- Mobile app installation capability
- Background sync for weather updates
- Push notifications for weather alerts

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with comprehensive tests
3. Ensure all quality checks pass (`npm run lint`, `npm run test`)
4. Submit pull request with detailed description

### Code Standards
- **TypeScript**: Strict mode with comprehensive type definitions
- **Testing**: Minimum 80% coverage for critical aviation calculations
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: Sub-3-second load times on 3G networks

### Aviation Safety Considerations
- All flight planning calculations must be cross-validated with authoritative sources
- Clear disclaimers that app supplements but doesn't replace official briefings
- Graceful degradation when weather/NOTAM services unavailable
- Error handling for safety-critical data

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Credits

**Development**: PAI Consulting - Keith Estes  
**Research**: GA pilot community feedback and aviation UX studies  
**Design**: Based on pilot community requirements and cockpit usability research

---

**Disclaimer**: This application is designed to supplement, not replace, official flight planning and weather briefing services. Pilots are responsible for obtaining official weather briefings and NOTAMs from appropriate sources before flight.

🛩️ *Built for aviators, by aviators*