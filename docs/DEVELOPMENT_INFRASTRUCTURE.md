# FlightPlan Development Infrastructure

## Overview

This document outlines the complete development infrastructure for the FlightPlan application, including CI/CD pipelines, deployment strategies, monitoring, and development workflows optimized for aviation software requirements.

## Development Environment Setup

### Prerequisites
```bash
# Required software versions
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0

# Recommended development tools
VS Code with extensions:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Thunder Client (API testing)
- GitLens
- Error Lens

# Optional but recommended
Docker >= 20.10.0 (for consistent environments)
```

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/pai-consulting/flight-plan.git
cd flight-plan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Environment Variables
```bash
# .env.example
# Mapbox (for primary mapping)
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Weather APIs
VITE_NOAA_API_KEY=your_noaa_api_key
VITE_WEATHER_API_BACKUP=your_backup_weather_api

# FAA APIs
VITE_FAA_API_KEY=your_faa_api_key
VITE_NOTAM_API_ENDPOINT=https://api.faa.gov/notam/v1

# Chart tile server
VITE_CHART_TILE_SERVER=https://your-chart-server.com

# Analytics (optional)
VITE_ANALYTICS_ID=your_analytics_id

# Development settings
VITE_DEBUG_MODE=true
VITE_API_TIMEOUT=30000
```

## CI/CD Pipeline (GitHub Actions)

### Main Workflow
```yaml
# .github/workflows/main.yml
name: FlightPlan CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests  
        run: npm run test:integration
        env:
          VITE_TEST_MODE: true
      
      - name: Build application
        run: npm run build
        env:
          VITE_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_ACCESS_TOKEN }}
          VITE_FAA_API_KEY: ${{ secrets.FAA_API_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files-${{ matrix.node-version }}
          path: dist/

  e2e-tests:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          VITE_TEST_MODE: true
      
      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Run CodeQL analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript
      
      - name: Perform CodeQL analysis
        uses: github/codeql-action/analyze@v2

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, e2e-tests]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for staging
        run: npm run build:staging
        env:
          VITE_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_ACCESS_TOKEN }}
          VITE_FAA_API_KEY: ${{ secrets.FAA_API_KEY }}
          VITE_ENVIRONMENT: staging
      
      - name: Deploy to GitHub Pages (staging)
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: npm run build:prod
        env:
          VITE_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_ACCESS_TOKEN }}
          VITE_FAA_API_KEY: ${{ secrets.FAA_API_KEY }}
          VITE_ENVIRONMENT: production
      
      - name: Run production tests
        run: npm run test:prod
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: flightplan.pai-consulting.com
      
      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

### Deployment Scripts
```json
{
  "scripts": {
    // Development
    "dev": "vite",
    "dev:https": "vite --https",
    "preview": "vite preview",
    
    // Building
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:prod": "tsc && vite build --mode production",
    
    // Testing
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "test:prod": "npm run build && npm run test:e2e",
    
    // Code Quality
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    
    // Deployment
    "deploy": "npm run build && gh-pages -d dist",
    "deploy:staging": "npm run build:staging && gh-pages -d dist -e staging",
    
    // Utilities
    "clean": "rm -rf dist node_modules/.vite",
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html",
    "lighthouse": "lhci autorun"
  }
}
```

## Code Quality Configuration

### ESLint Configuration
```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'jsx-a11y'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'jsx-a11y/no-autofocus': 'off', // Sometimes needed for aviation UX
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Husky Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test:unit"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

## Monitoring and Analytics

### Performance Monitoring
```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceEntry[]> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  startTiming(name: string): void {
    performance.mark(`${name}-start`)
  }
  
  endTiming(name: string): number {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const entries = performance.getEntriesByName(name)
    const duration = entries[entries.length - 1].duration
    
    this.recordMetric(name, duration)
    return duration
  }
  
  recordMetric(name: string, value: number): void {
    // Record to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value)
    }
  }
  
  private sendToAnalytics(name: string, value: number): void {
    // Implementation for analytics service
    console.log(`Metric: ${name} = ${value}ms`)
  }
}

// Usage in components
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance()
  
  const trackApiCall = useCallback(async <T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    monitor.startTiming(`api-${name}`)
    try {
      const result = await apiCall()
      monitor.endTiming(`api-${name}`)
      return result
    } catch (error) {
      monitor.endTiming(`api-${name}`)
      throw error
    }
  }, [monitor])
  
  return { trackApiCall }
}
```

### Error Tracking
```typescript
// src/utils/errorTracking.ts
export class ErrorTracker {
  private static instance: ErrorTracker
  
  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }
  
  trackError(error: Error, context?: Record<string, any>): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    }
    
    // Send to error tracking service
    this.reportError(errorInfo)
  }
  
  trackApiError(error: APIError, endpoint: string): void {
    this.trackError(error, {
      type: 'api_error',
      endpoint,
      status: error.status,
      response: error.response
    })
  }
  
  private reportError(errorInfo: any): void {
    if (process.env.NODE_ENV === 'production') {
      // Implementation for error tracking service
      console.error('Error tracked:', errorInfo)
    }
  }
}

// React Error Boundary
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    ErrorTracker.getInstance().trackError(error, {
      type: 'react_error',
      componentStack: errorInfo.componentStack
    })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Lighthouse CI Configuration
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/route-planning",
        "http://localhost:3000/weather"
      ],
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "ready in"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Security Configuration

### Content Security Policy
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://api.mapbox.com;
  style-src 'self' 'unsafe-inline' https://api.mapbox.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' 
    https://api.faa.gov 
    https://aviationweather.gov 
    https://api.mapbox.com
    wss://events.mapbox.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-ancestors 'self' https://*.squarespace.com;
">
```

### Security Headers (for deployment)
```typescript
// Security headers for deployment
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}
```

## Documentation and API Reference

### Component Documentation
```typescript
// src/components/WeatherPanel/WeatherPanel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { WeatherPanel } from './WeatherPanel'
import { mockWeatherData } from '../../test/mocks'

const meta: Meta<typeof WeatherPanel> = {
  title: 'Components/Weather/WeatherPanel',
  component: WeatherPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays weather information for selected airports with METAR/TAF data'
      }
    }
  },
  argTypes: {
    selectedAirports: {
      control: 'object',
      description: 'Array of airport identifiers to display weather for'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selectedAirports: ['KORD', 'KMDW'],
    onAirportSelect: (airport) => console.log('Selected:', airport)
  }
}

export const Loading: Story = {
  args: {
    selectedAirports: ['KORD'],
    onAirportSelect: (airport) => console.log('Selected:', airport)
  },
  parameters: {
    mockData: { loading: true }
  }
}
```

### Changelog Management
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Enhanced NOTAM visualization with graphical overlays
- Radial menu system for map interactions

### Changed
- Improved weather data caching strategy
- Updated UI components for better touch responsiveness

### Fixed
- Fixed route calculation accuracy for high-altitude flights
- Resolved memory leak in map tile loading

## [1.0.0] - 2024-01-15
### Added
- Initial release with core flight planning features
- Interactive route planning with drag-and-drop editing
- Comprehensive weather integration (METAR, TAF, radar)
- Weight and balance calculator
- Aircraft performance calculations
- ForeFlight and Garmin export compatibility
```

This development infrastructure provides a comprehensive foundation for professional aviation software development with robust testing, deployment, and monitoring capabilities.