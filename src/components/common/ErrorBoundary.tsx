import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log error for debugging
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      const { error } = this.state

      if (Fallback && error) {
        return <Fallback error={error} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An unexpected error occurred'}
              </p>
              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
                  className="w-full btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full btn-outline"
                >
                  Reload Page
                </button>
              </div>
              
              {/* Development error details */}
              {import.meta.env.DEV && error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}