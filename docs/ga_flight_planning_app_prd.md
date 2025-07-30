**Product Requirements Document (PRD)**

**Title:** General Aviation Flight Planning Web App

**Owner:** PAI Consulting

**Date:** 2025-07-30

---

## Overview

This document outlines the requirements for a browser-based, public-use flight planning web application designed for general aviation pilots and single-pilot operators in the United States. The application will be published on GitHub Pages and embedded via iFrame in the PAI Consulting Squarespace 7.1 website.

The tool aims to simplify the preflight planning process while offering smart, modern features that go beyond traditional planners. Future updates may add login functionality for personalization and data sync.

## Goals

- Provide GA pilots with an easy-to-use, full-featured preflight planning tool
- Offer essential flight planning features with an intuitive UI
- Include integrations for data export and weather/NOTAM briefing
- Use PAI Consulting branding for a professional, consistent experience
- Ensure compatibility with tablets and desktops (responsive design)

---

## Target Users

- General aviation pilots (private, commercial)
- Student pilots preparing cross-country flights
- Single-pilot operators flying under VFR or IFR in the U.S.

---

## Functional Requirements

### Phase 1: MVP (Public, No Login)

#### Core Features (High Priority)

- **Interactive Route Planning**

  - Plot route by entering airports, VORs, or GPS coordinates
  - Click-and-drag route editing on VFR/IFR charts
  - Display route over sectional, TAC, and low/high IFR charts
  - Include navigation log (leg times, distances, ETE, fuel, etc.)

- **Weather Briefing**

  - METAR and TAF display for all airports in route
  - NEXRAD radar and satellite overlays
  - Winds aloft data (visualized at altitude layers)
  - PIREPs and AIRMET/SIGMET overlays on map

- **NOTAM & TFR Display**

  - NOTAMs parsed and pinned visually on airport diagrams or map
  - TFRs shown as polygons with alerts and details

- **Weight and Balance Calculator**

  - Load multiple aircraft profiles
  - Input weights for crew, passengers, baggage, and fuel
  - Auto-calculate CG and plot on envelope diagram

- **Aircraft Performance Estimates**

  - Enter aircraft TAS and fuel burn
  - Automatically factor in winds aloft for leg-by-leg estimates
  - Support multiple profiles (e.g., cruise altitudes)

- **Airport Data Display**

  - Pull from FAA Chart Supplement database
  - Show runway lengths/surfaces, frequencies, elevation, fuel
  - Link to diagrams and (if available) approach plates

- **Map Features**

  - Toggle overlays for airspace, terrain, weather, and TFRs
  - Vertical profile view of terrain and airspace along route

---

### Phase 2: Medium Priority Feature Set

- **Fuel Price Overlay** (pull from AirNav or similar database)
- **Altitude and Route Optimization** (fastest, fuel-saving)
- **Flight Plan Export (ForeFlight/Garmin/GPX)**
- **File Flight Plan via 1800wxbrief API (if available)**
- **Custom Aircraft Checklists (basic form)**
- **Terrain Alerts (color terrain overlays with red/green threshold)**
- **Alternate/Diversion Planner (suggest alternates by weather/fuel)**
- **Split-screen map + W&B or Profile View**

---

### Phase 3: "Wow Factor" Differentiators

- **3D Map/Terrain Visualization** (WebGL or Cesium.js)
- **Graphical NOTAM Overlay (highlight closed runways, dropzones, etc.)**
- **Radial Menu for Airport/Route Options**
- **Live ADS-B IN Integration for Traffic/Weather (future mobile version)**
- **AI Assistant (suggests departure time changes, alerts, optimizations)**
- **Social Sharing / Flight Plan Collaboration**
- **Export to CloudAhoy or Garmin Panel (e.g., .fpl/.gfp file support)**

---

## Non-Functional Requirements

- **Performance**: Fast load times, responsive panning/zooming
- **Security**: No user data stored in Phase 1; secure API access in Phase 2+
- **Branding**: Use PAI Consulting color palette and logos (see Brand Kit)
- **Compatibility**: iOS, Android, desktop browsers (Chrome, Safari, Edge)
- **Accessibility**: Basic WCAG 2.1 AA compliance for text contrast and nav

---

## UX/UI Design Principles

- Clean interface with progressive disclosure
- Touch-friendly controls for mobile/tablet use
- Dark mode/night map theme toggle
- Visual iconography (wind, airport, fuel, warning symbols)
- Resizable split panes on wide screens
- Save customization in local storage (Phase 1); accounts later

---

## Technical Stack (Proposed)

- **Frontend**: React or Vue (static site build), hosted via GitHub Pages
- **Mapping**: Mapbox GL JS or Leaflet with FAA sectional/TAC tile overlays
- **Backend (if needed)**: Node.js API server (optional; Phase 2)
- **Data Sources**:
  - FAA (NOTAMs, charts, Chart Supplement)
  - NOAA (weather, winds, radar)
  - 1800wxbrief/Leidos (optional for filing)
  - AirNav or ForeFlight Directory (for fuel prices)

---

## Embedding on Squarespace

- Output as GitHub Pages static site
- Embed using Squarespace Code Block in iFrame:
  ```html
  <iframe src="https://yourusername.github.io/flightplanner" width="100%" height="800px" frameborder="0"></iframe>
  ```

---

## Roadmap

1. **MVP Build** (core route + weather + NOTAMs + W&B + UI)
2. **Export & Fuel Enhancements**
3. **Profile Optimization + Filing**
4. **Wow Features (3D, AI, Collaboration)**

---

## Future Considerations

- Add optional user accounts for saved plans, aircraft, checklists
- Offer premium features as upgrades (mobile app, ADS-B in, etc.)
- API access for partners (training schools, CFI dashboards)
- Publish as a Progressive Web App (PWA) for offline cockpit use

---

## Appendix

**Brand Colors:**

- Navy: #033668
- Light Blue: #4ab8fd / #2b92f9
- Accent: #dcd9e1, #b0e0fe
- Background: #f2f2f2 / #ffffff

**Logo Options:** Available in PNG from PAI Consulting Brand Kit

**Sources:**

- Reddit (/r/flying, /r/aviationmechanic)
- Pilot forums, AvWeb, AOPA Pilot Magazine
- SkyVector, ForeFlight, Garmin Pilot UI reviews

---

*End of PRD*

