"use client"

import { Component } from "react"
import { Button } from "@/components/ui/button"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">We're sorry, but something unexpected happened.</p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>Try Again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
