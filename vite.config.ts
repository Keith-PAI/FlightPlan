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
          },
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      manifest: {
        name: 'FlightPlan - GA Flight Planning',
        short_name: 'FlightPlan',
        description: 'General Aviation Flight Planning Tool for PAI Consulting',
        theme_color: '#033668',
        background_color: '#f2f2f2',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
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
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store')
    }
  },
  
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
          'map-vendor': ['mapbox-gl', 'leaflet', 'react-map-gl', 'react-leaflet'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'utils-vendor': ['axios', 'date-fns', 'lodash-es', 'clsx', 'nanoid']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  preview: {
    port: 3000,
    host: true
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})