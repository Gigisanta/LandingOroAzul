'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="fixed inset-0 -z-10 flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-dark)' }}
          >
            <div className="text-center p-8">
              <p className="text-white/70 text-lg mb-2">Error cargando visualización 3D</p>
              <p className="text-white/50 text-sm">
                {this.state.error?.message || 'Error desconocido'}
              </p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
