# FlightPlan UI/UX Design System

## Overview

The FlightPlan UI/UX design system is built around aviation-specific requirements identified through extensive pilot community research. The design prioritizes single-pilot operation, reduces cognitive load, and provides essential information with minimal head-down time.

## Design Principles

### 1. Pilot-Centric Design Philosophy

**Primary Goals:**
- **Minimize Head-Down Time**: Critical for cockpit safety
- **Reduce Cognitive Load**: Single-pilot operation optimization
- **Maximize Efficiency**: Quick access to essential information
- **Ensure Readability**: Various lighting conditions and stress levels

**Key Research Insights:**
- Pilots prefer simplified interfaces over feature-heavy designs
- "25 tiny buttons" approach is counterproductive
- Progressive disclosure is essential for complex workflows
- Touch-friendly controls are mandatory for tablet use

### 2. Progressive Disclosure Strategy

```
Level 1: Essential Information (Always Visible)
├── Current route overview
├── Weather summary
├── Critical NOTAMs/TFRs
└── Aircraft status

Level 2: Detailed Information (One Click/Tap)
├── Detailed weather data
├── NOTAM details
├── Navigation log
└── Weight & balance

Level 3: Advanced Features (Menu/Settings)
├── Route optimization
├── Export functions
├── Preferences
└── System settings
```

## Visual Design System

### Color Palette (PAI Consulting Brand)

#### Primary Colors
```css
:root {
  /* Primary Navy */
  --color-primary: #033668;
  --color-primary-light: #0a4a89;
  --color-primary-dark: #022447;
  
  /* Light Blue Accents */
  --color-accent: #4ab8fd;
  --color-accent-alt: #2b92f9;
  
  /* Secondary Colors */
  --color-secondary: #dcd9e1;
  --color-secondary-light: #b0e0fe;
  
  /* Base Colors */
  --color-background: #f2f2f2;
  --color-surface: #ffffff;
}
```

#### Night Vision Mode
```css
:root[data-theme="night"] {
  /* Red-light compatible palette */
  --color-primary: #4a0000;
  --color-accent: #ff4444;
  --color-background: #1a0000;
  --color-surface: #2a0000;
  --color-text: #ff8888;
  --color-text-secondary: #cc4444;
}
```

#### Aviation-Specific Colors
```css
:root {
  /* Weather Colors */
  --color-vfr: #00cc00;        /* Green - VFR conditions */
  --color-mvfr: #0066cc;       /* Blue - MVFR conditions */
  --color-ifr: #cc6600;        /* Orange - IFR conditions */
  --color-lifr: #cc0000;       /* Red - LIFR conditions */
  
  /* NOTAM Severity */
  --color-critical: #dc2626;   /* Critical NOTAMs */
  --color-high: #ea580c;       /* High priority */
  --color-medium: #d97706;     /* Medium priority */
  --color-low: #65a30d;        /* Low priority */
  
  /* Weight & Balance */
  --color-within-limits: #16a34a; /* Green - safe */
  --color-near-limits: #ca8a04;   /* Yellow - caution */
  --color-over-limits: #dc2626;   /* Red - unsafe */
}
```

### Typography System

```css
/* Primary font family */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* Font Families */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Roboto Mono', monospace;
  
  /* Font Sizes (Optimized for aviation readability) */
  --text-xs: 0.75rem;    /* 12px - small labels */
  --text-sm: 0.875rem;   /* 14px - secondary text */
  --text-base: 1rem;     /* 16px - body text */
  --text-lg: 1.125rem;   /* 18px - important info */
  --text-xl: 1.25rem;    /* 20px - headings */
  --text-2xl: 1.5rem;    /* 24px - major headings */
  --text-3xl: 2rem;      /* 32px - display text */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights (Optimized for readability) */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}

/* Aviation-specific typography */
.aviation-identifier {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.weather-data {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-tight);
}

.critical-text {
  font-weight: var(--font-bold);
  color: var(--color-critical);
}
```

### Spacing and Layout System

```css
:root {
  /* Spacing Scale (8px base unit) */
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  
  /* Touch Target Sizes (Aviation/Cockpit Optimized) */
  --touch-sm: 40px;    /* Minimum for small controls */
  --touch-md: 48px;    /* Standard touch target */
  --touch-lg: 56px;    /* Large buttons/primary actions */
  --touch-xl: 64px;    /* Critical/emergency controls */
  
  /* Border Radius */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem;   /* 8px */
  --radius-xl: 0.75rem;  /* 12px */
}
```

## Component Design System

### 1. Navigation and Layout Components

#### Primary Navigation
```typescript
interface PrimaryNavProps {
  activePanel: PanelType
  onPanelChange: (panel: PanelType) => void
  compactMode?: boolean
}

// Design Specifications
const PrimaryNavStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '60px',
  width: '100%',
  background: 'var(--color-primary)',
  zIndex: 1000,
  
  // Mobile-first responsive
  '@media (min-width: 768px)': {
    height: '64px'
  }
}
```

#### Sidebar Panel System
```typescript
interface SidebarPanelProps {
  type: 'weather' | 'notam' | 'route' | 'aircraft'
  isOpen: boolean
  onClose: () => void
  width?: 'sm' | 'md' | 'lg'
  position?: 'left' | 'right'
}

// Responsive width system
const SidebarWidths = {
  sm: {
    mobile: '280px',
    tablet: '320px',
    desktop: '360px'
  },
  md: {
    mobile: '320px',
    tablet: '400px',
    desktop: '480px'
  },
  lg: {
    mobile: '100vw',
    tablet: '480px',
    desktop: '600px'
  }
}
```

### 2. Map Interface Components

#### Map Container
```typescript
interface MapContainerProps {
  route?: Route
  center: LatLng
  zoom: number
  layers: LayerConfig[]
  onMapChange: (viewport: MapViewport) => void
  showControls?: boolean
  nightMode?: boolean
}

// Map control specifications
const MapControls = {
  zoom: {
    position: 'top-right',
    size: 'var(--touch-md)',
    spacing: 'var(--space-2)'
  },
  layers: {
    position: 'top-left',
    maxHeight: '60vh',
    overflow: 'auto'
  },
  scale: {
    position: 'bottom-left',
    units: 'nautical'
  }
}
```

#### Radial Menu System (Garmin-Inspired)
```typescript
interface RadialMenuProps {
  center: LatLng
  items: RadialMenuItem[]
  onItemSelect: (item: RadialMenuItem) => void
  radius?: number
  visible: boolean
}

interface RadialMenuItem {
  id: string
  label: string
  icon: IconType
  action: () => void
  disabled?: boolean
  color?: string
}

// Radial menu design
const RadialMenuStyle = {
  radius: '80px',
  itemSize: 'var(--touch-lg)',
  backgroundColor: 'rgba(3, 54, 104, 0.9)', // Semi-transparent primary
  backdropFilter: 'blur(8px)',
  transition: 'all 0.2s ease-in-out',
  
  // Item positioning (8 items max for usability)
  itemPositions: [
    { angle: 0, label: 'North' },
    { angle: 45, label: 'NE' },
    { angle: 90, label: 'East' },
    { angle: 135, label: 'SE' },
    { angle: 180, label: 'South' },
    { angle: 225, label: 'SW' },
    { angle: 270, label: 'West' },
    { angle: 315, label: 'NW' }
  ]
}
```

### 3. Data Display Components

#### Weather Card
```typescript
interface WeatherCardProps {
  airport: string
  weather: WeatherReport
  compact?: boolean
  showDetails?: boolean
  onDetailsToggle?: () => void
}

// Weather card design
const WeatherCardStyle = {
  minHeight: '120px',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-secondary)',
  backgroundColor: 'var(--color-surface)',
  
  // Condition-based border colors
  borderColor: {
    VFR: 'var(--color-vfr)',
    MVFR: 'var(--color-mvfr)',
    IFR: 'var(--color-ifr)',
    LIFR: 'var(--color-lifr)'
  }
}
```

#### NOTAM Display (Critical Differentiator)
```typescript
interface NOTAMDisplayProps {
  notam: ParsedNOTAM
  showGraphical?: boolean
  onVisualize?: () => void
  severity: 'critical' | 'high' | 'medium' | 'low'
}

// NOTAM visual design
const NOTAMDisplayStyle = {
  padding: 'var(--space-3)',
  borderLeft: '4px solid',
  borderLeftColor: {
    critical: 'var(--color-critical)',
    high: 'var(--color-high)',
    medium: 'var(--color-medium)',
    low: 'var(--color-low)'
  },
  backgroundColor: {
    critical: 'rgba(220, 38, 38, 0.1)',
    high: 'rgba(234, 88, 12, 0.1)',
    medium: 'rgba(217, 119, 6, 0.1)',
    low: 'rgba(101, 163, 13, 0.1)'
  }
}
```

### 4. Form and Input Components

#### Aviation Input Field
```typescript
interface AviationInputProps {
  type: 'airport' | 'waypoint' | 'frequency' | 'number'
  value: string
  onChange: (value: string) => void
  validation?: ValidationRule[]
  autoComplete?: boolean
  placeholder?: string
}

// Aviation-specific input styling
const AviationInputStyle = {
  height: 'var(--touch-md)',
  padding: '0 var(--space-3)',
  border: '2px solid var(--color-secondary)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  fontFamily: 'var(--font-mono)', // For identifiers
  textTransform: 'uppercase',
  
  // Focus states
  '&:focus': {
    borderColor: 'var(--color-accent)',
    boxShadow: '0 0 0 3px rgba(74, 184, 253, 0.1)'
  },
  
  // Validation states
  '&[data-valid="false"]': {
    borderColor: 'var(--color-critical)',
    backgroundColor: 'rgba(220, 38, 38, 0.05)'
  }
}
```

#### Weight & Balance Controls
```typescript
interface WeightBalanceControlsProps {
  aircraft: AircraftProfile
  loading: LoadingData
  onChange: (loading: LoadingData) => void
  showEnvelope: boolean
}

// Weight & Balance UI specifications
const WeightBalanceStyle = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 120px',
    gap: 'var(--space-2)',
    alignItems: 'center'
  },
  
  envelope: {
    minHeight: '300px',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-secondary)',
    borderRadius: 'var(--radius-lg)'
  },
  
  // Visual indicators
  withinLimits: {
    color: 'var(--color-within-limits)',
    fontWeight: 'var(--font-semibold)'
  },
  nearLimits: {
    color: 'var(--color-near-limits)',
    fontWeight: 'var(--font-semibold)'
  },
  overLimits: {
    color: 'var(--color-over-limits)',
    fontWeight: 'var(--font-bold)',
    animation: 'pulse 2s infinite'
  }
}
```

## Responsive Design Strategy

### Breakpoint System
```css
:root {
  /* Mobile First Breakpoints */
  --bp-sm: 640px;   /* Small tablets */
  --bp-md: 768px;   /* iPad Mini/Medium tablets */
  --bp-lg: 1024px;  /* iPad Pro/Large tablets */
  --bp-xl: 1280px;  /* Desktop */
  --bp-2xl: 1536px; /* Large desktop */
}

/* Aviation device priorities */
@media (max-width: 640px) {
  /* iPhone in landscape, small Android tablets */
  .map-container { height: calc(100vh - 60px); }
  .sidebar { width: 100vw; }
  .touch-target { min-height: 48px; }
}

@media (min-width: 641px) and (max-width: 768px) {
  /* iPad Mini, medium tablets */
  .map-container { height: calc(100vh - 64px); }
  .sidebar { width: 320px; }
  .touch-target { min-height: 44px; }
}

@media (min-width: 769px) {
  /* iPad Pro, desktop */
  .layout { display: grid; grid-template-columns: 400px 1fr; }
  .sidebar { position: static; }
  .touch-target { min-height: 40px; }
}
```

### Touch Optimization
```css
/* Touch-friendly controls */
.touch-optimized {
  min-height: var(--touch-md);
  min-width: var(--touch-md);
  padding: var(--space-2) var(--space-3);
  
  /* Improved touch feedback */
  -webkit-tap-highlight-color: rgba(74, 184, 253, 0.2);
  touch-action: manipulation;
  
  /* Prevent accidental selections */
  user-select: none;
  -webkit-user-select: none;
}

/* Critical controls (emergency, alerts) */
.critical-control {
  min-height: var(--touch-xl);
  min-width: var(--touch-xl);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
```css
/* Color contrast ratios */
:root {
  --contrast-normal: 4.5; /* Minimum for normal text */
  --contrast-large: 3.0;  /* Minimum for large text */
  --contrast-graphics: 3.0; /* UI components and graphics */
}

/* Focus indicators */
*:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Aviation-Specific Accessibility
```css
/* Colorblind-friendly design */
.colorblind-friendly {
  /* Use patterns/shapes in addition to color */
  &[data-condition="vfr"] {
    background-image: url('data:image/svg+xml;base64,...'); /* Green pattern */
  }
  
  &[data-condition="ifr"] {
    background-image: url('data:image/svg+xml;base64,...'); /* Orange pattern */
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000000;
    --color-accent: #0066cc;
    --color-background: #ffffff;
    filter: contrast(1.2);
  }
}
```

## Animation and Micro-Interactions

### Transition System
```css
:root {
  /* Transition durations */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;
  
  /* Easing functions */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Loading states */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Status indicators */
.status-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

This UI/UX design system provides a comprehensive foundation for building an aviation-focused interface that meets the specific needs identified in pilot community research while maintaining professional aesthetics and regulatory compliance.