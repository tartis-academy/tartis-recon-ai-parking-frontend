import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RemoteUnavailable } from './RemoteUnavailable'

interface RemoteErrorBoundaryProps {
  children: ReactNode
  moduleName?: string
}

interface RemoteErrorBoundaryState {
  hasError: boolean
}

export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): RemoteErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[RemoteErrorBoundary] ${this.props.moduleName ?? 'unknown'}:`,
      error,
      errorInfo,
    )
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <RemoteUnavailable />
    }
    return this.props.children
  }
}
