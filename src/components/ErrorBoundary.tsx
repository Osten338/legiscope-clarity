
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Application error:", error);
    console.error("Error details:", errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-100">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-slate-700 mb-4">
              The application encountered an error. This could be due to:
            </p>
            <ul className="list-disc pl-5 mb-6 text-slate-600 space-y-1">
              <li>Temporary service disruption</li>
              <li>Data loading issue</li>
              <li>Unexpected application state</li>
            </ul>
            <p className="text-sm text-slate-500 mb-6">
              Error: {this.state.error?.message || "Unknown error"}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-sage-600 text-white py-2 px-4 rounded-md hover:bg-sage-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
