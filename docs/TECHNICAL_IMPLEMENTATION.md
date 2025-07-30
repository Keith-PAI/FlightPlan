# FlightPlan Technical Implementation Specifications

## Overview

This document provides detailed technical specifications for implementing the FlightPlan application, including project structure, development standards, build configuration, and deployment requirements.

## Project Structure

### Directory Organization
```
flight-plan/
├── public/                     # Static assets
│   ├── icons/                 # App icons and favicons
│   ├── images/                # Static images and branding
│   ├── charts/                # Cached chart tiles (optional)
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/            # React components
│   │   ├── common/           # Shared/utility components
│   │   ├── layout/           # Layout components
│   │   ├── map/              # Map-related components
│   │   ├── weather/          # Weather components
│   │   ├── route/            # Route planning components
│   │   ├── aircraft/         # Aircraft management
│   │   ├── notam/            # NOTAM display components
│   │   └── export/           # Export functionality
│   ├── services/              # Business logic services
│   │   ├── api/              # API integration services
│   │   ├── cache/            # Caching services
│   │   ├── validation/       # Validation services
│   │   └── export/           # Export services
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # State management (Zustand)
│   ├── utils/                 # Utility functions
│   │   ├── aviation/         # Aviation calculations
│   │   ├── geo/              # Geographic utilities
│   │   ├── formatting/       # Data formatting
│   │   └── constants/        # Constants and enums
│   ├── types/                 # TypeScript type definitions
│   ├── styles/                # Global styles and themes
│   ├── assets/                # Images, fonts, etc.
│   └── workers/               # Service workers and web workers
├── docs/                      # Project documentation
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
├── scripts/                   # Build and deployment scripts
└── config/                    # Configuration files
```

### File Naming Conventions
```typescript
// Components: PascalCase with descriptive names
MapContainer.tsx
WeatherPanel.tsx
NOTAMOverlay.tsx
AircraftSelector.tsx

// Services: camelCase with Service suffix
weatherService.ts
routeService.ts
notamService.ts
exportService.ts

// Hooks: camelCase with use prefix
useRoute.ts
useWeather.ts
useAircraft.ts
useLocalStorage.ts

// Types: PascalCase with Type suffix or descriptive interface names
RouteTypes.ts
WeatherTypes.ts
interface Route {}
interface WeatherReport {}

// Utilities: camelCase with descriptive names
aviationCalculations.ts
geoUtils.ts
formatters.ts
validators.ts
```

## Technology Stack Implementation

### Core Dependencies
```json
{
  "dependencies": {
    // Core Framework
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    
    // State Management
    "zustand": "^4.3.0",
    "react-query": "^3.39.0",
    
    // UI Framework
    "tailwindcss": "^3.2.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "framer-motion": "^10.0.0",
    
    // Mapping
    "mapbox-gl": "^2.13.0",
    "react-map-gl": "^7.0.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.2.0",
    
    // Forms and Validation
    "react-hook-form": "^7.43.0",
    "zod": "^3.20.0",
    "@hookform/resolvers": "^2.9.0",
    
    // Data Handling
    "axios": "^1.3.0",
    "date-fns": "^2.29.0",
    "lodash-es": "^4.17.0",
    
    // Utilities
    "clsx": "^1.2.0",
    "nanoid": "^4.0.0"
  },
  
  "devDependencies": {
    // Build Tools
    "vite": "^4.1.0",
    "typescript": "^4.9.0",
    "@vitejs/plugin-react": "^3.1.0",
    "@vitejs/plugin-pwa": "^0.14.0",
    
    // Testing
    "vitest": "^0.28.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "playwright": "^1.31.0",
    
    // Code Quality
    "eslint": "^8.35.0",
    "@typescript-eslint/eslint-plugin": "^5.54.0",
    "prettier": "^2.8.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.1.0"
  }
}
```

### Build Configuration (Vite)
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.faa\.gov\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'faa-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/aviationweather\.gov\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      },
      manifest: {
        name: 'FlightPlan - GA Flight Planning',
        short_name: 'FlightPlan',
        description: 'General Aviation Flight Planning Tool',
        theme_color: '#033668',
        background_color: '#f2f2f2',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          map: ['mapbox-gl', 'leaflet'],
          ui: ['@headlessui/react', 'framer-motion']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true
  },
  
  preview: {
    port: 3000
  }
})
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // PAI Consulting Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2b92f9',
          600: '#033668',
          700: '#022447',
          900: '#011629'
        },
        accent: {
          400: '#4ab8fd',
          500: '#2b92f9'
        },
        secondary: {
          100: '#b0e0fe',
          200: '#dcd9e1',
          300: '#f2f2f2'
        },
        
        // Aviation-specific colors
        aviation: {
          vfr: '#00cc00',
          mvfr: '#0066cc',
          ifr: '#cc6600',
          lifr: '#cc0000',
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#d97706',
          low: '#65a30d'
        }
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Roboto Mono', 'monospace']
      },
      
      spacing: {
        'touch-sm': '40px',
        'touch-md': '48px',
        'touch-lg': '56px',
        'touch-xl': '64px'
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

## Core Implementation Patterns

### Service Implementation Pattern
```typescript
// Base service interface
interface BaseService {
  initialize(): Promise<void>
  cleanup(): void
  getStatus(): ServiceStatus
}

// Example service implementation
class WeatherService implements IWeatherService, BaseService {
  private client: APIClient
  private cache: Cache
  private eventBus: EventBus
  
  constructor(config: WeatherServiceConfig) {
    this.client = new APIClient(config.apiConfig)
    this.cache = new Cache(config.cacheConfig)
    this.eventBus = EventBus.getInstance()
  }
  
  async initialize(): Promise<void> {
    await this.client.initialize()
    this.setupEventListeners()
  }
  
  cleanup(): void {
    this.client.cleanup()
    this.eventBus.removeAllListeners(this)
  }
  
  getStatus(): ServiceStatus {
    return {
      healthy: this.client.isHealthy(),
      lastUpdate: this.cache.getLastUpdate(),
      errorCount: this.client.getErrorCount()
    }
  }
  
  // Service-specific methods...
  async getCurrentWeather(airports: string[]): Promise<WeatherReport[]> {
    // Implementation with error handling, caching, etc.
  }
  
  private setupEventListeners(): void {
    this.eventBus.on('app:online', this.handleOnline.bind(this))
    this.eventBus.on('app:offline', this.handleOffline.bind(this))
  }
}
```

### Component Implementation Pattern
```typescript
// Component with proper TypeScript and hooks
interface WeatherPanelProps {
  route?: Route
  selectedAirports: string[]
  onAirportSelect: (airport: string) => void
  className?: string
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
  route,
  selectedAirports,
  onAirportSelect,
  className
}) => {
  const { weather, isLoading, error, refresh } = useWeather(selectedAirports)
  const [showDetails, setShowDetails] = useState(false)
  
  // Memoized calculations
  const weatherSummary = useMemo(() => {
    if (!weather.length) return null
    return calculateWeatherSummary(weather)
  }, [weather])
  
  // Error boundary handling
  if (error) {
    return (
      <ErrorBoundary>
        <WeatherError error={error} onRetry={refresh} />
      </ErrorBoundary>
    )
  }
  
  return (
    <div className={clsx('weather-panel', className)}>
      <WeatherHeader 
        summary={weatherSummary}
        isLoading={isLoading}
        onRefresh={refresh}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WeatherDetails 
              weather={weather}
              onAirportSelect={onAirportSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### State Management Pattern
```typescript
// Zustand store with TypeScript and persistence
interface RouteStore {
  // State
  routes: Route[]
  activeRoute: Route | null
  isEditing: boolean
  
  // Actions
  setActiveRoute: (route: Route | null) => void
  addRoute: (route: Route) => void
  updateRoute: (id: string, updates: Partial<Route>) => void
  deleteRoute: (id: string) => void
  
  // Async actions
  saveRoute: (route: Route) => Promise<void>
  loadRoute: (id: string) => Promise<Route | null>
}

export const useRouteStore = create<RouteStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        routes: [],
        activeRoute: null,
        isEditing: false,
        
        // Synchronous actions
        setActiveRoute: (route) => set({ activeRoute: route }),
        
        addRoute: (route) => set((state) => ({
          routes: [...state.routes, route]
        })),
        
        updateRoute: (id, updates) => set((state) => ({
          routes: state.routes.map(route => 
            route.id === id ? { ...route, ...updates } : route
          ),
          activeRoute: state.activeRoute?.id === id 
            ? { ...state.activeRoute, ...updates }
            : state.activeRoute
        })),
        
        deleteRoute: (id) => set((state) => ({
          routes: state.routes.filter(route => route.id !== id),
          activeRoute: state.activeRoute?.id === id ? null : state.activeRoute
        })),
        
        // Async actions
        saveRoute: async (route) => {
          try {
            await routeService.save(route)
            set((state) => ({
              routes: state.routes.some(r => r.id === route.id)
                ? state.routes.map(r => r.id === route.id ? route : r)
                : [...state.routes, route]
            }))
          } catch (error) {
            console.error('Failed to save route:', error)
            throw error
          }
        },
        
        loadRoute: async (id) => {
          try {
            const route = await routeService.load(id)
            if (route) {
              set({ activeRoute: route })
            }
            return route
          } catch (error) {
            console.error('Failed to load route:', error)
            return null
          }
        }
      }),
      {
        name: 'flight-plan-routes',
        partialize: (state) => ({
          routes: state.routes
        })
      }
    )
  )
)
```

## Testing Implementation

### Unit Testing Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

// src/test/setup.ts
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

### Component Testing Pattern
```typescript
// tests/unit/components/WeatherPanel.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { WeatherPanel } from '@/components/weather/WeatherPanel'
import { mockWeatherData } from '../mocks/weatherMocks'

// Mock the weather service
vi.mock('@/services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: vi.fn().mockResolvedValue(mockWeatherData)
  }
}))

describe('WeatherPanel', () => {
  const defaultProps = {
    selectedAirports: ['KORD', 'KMDW'],
    onAirportSelect: vi.fn()
  }
  
  it('renders weather data correctly', async () => {
    render(<WeatherPanel {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('KORD')).toBeInTheDocument()
      expect(screen.getByText('KMDW')).toBeInTheDocument()
    })
  })
  
  it('handles airport selection', () => {
    render(<WeatherPanel {...defaultProps} />)
    
    fireEvent.click(screen.getByText('KORD'))
    
    expect(defaultProps.onAirportSelect).toHaveBeenCalledWith('KORD')
  })
  
  it('displays loading state', () => {
    render(<WeatherPanel {...defaultProps} />)
    
    expect(screen.getByText('Loading weather...')).toBeInTheDocument()
  })
})
```

### E2E Testing Setup
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  webServer: {
    command: 'npm run dev',
    port: 3000
  }
})
```

## Performance Optimization

### Code Splitting Strategy
```typescript
// Lazy loading for route-level components
const RouteManager = lazy(() => import('@/components/route/RouteManager'))
const WeatherPanel = lazy(() => import('@/components/weather/WeatherPanel'))
const NOTAMPanel = lazy(() => import('@/components/notam/NOTAMPanel'))

// Bundle analysis configuration
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// In vite.config.ts build options
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Vendor chunks
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['@headlessui/react', 'framer-motion'],
        'map-vendor': ['mapbox-gl', 'leaflet'],
        
        // Feature chunks
        'weather': ['@/services/weatherService', '@/components/weather'],
        'route': ['@/services/routeService', '@/components/route'],
        'notam': ['@/services/notamService', '@/components/notam']
      }
    }
  }
}
```

### Memory Management
```typescript
// Service cleanup pattern
export class ServiceManager {
  private services = new Map<string, BaseService>()
  
  register<T extends BaseService>(name: string, service: T): T {
    this.services.set(name, service)
    return service
  }
  
  async cleanup(): Promise<void> {
    for (const [name, service] of this.services.entries()) {
      try {
        await service.cleanup()
        console.log(`Cleaned up service: ${name}`)
      } catch (error) {
        console.error(`Failed to cleanup service ${name}:`, error)
      }
    }
    this.services.clear()
  }
}

// React component cleanup
export const useCleanup = (cleanupFn: () => void) => {
  useEffect(() => {
    return cleanupFn
  }, [cleanupFn])
}
```

This technical implementation specification provides a complete foundation for building the FlightPlan application with modern development practices, robust architecture, and aviation-specific requirements.