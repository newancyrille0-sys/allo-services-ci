"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays a friendly error message
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to error reporting service
    // In production, you might send this to Sentry, LogRocket, etc.
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `.trim();

    // In production, you might send this to an error reporting API
    // For now, we'll copy to clipboard
    navigator.clipboard.writeText(errorDetails).then(() => {
      alert("Erreur copiée dans le presse-papiers. Vous pouvez la coller dans un rapport.");
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Error Icon */}
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">
                  Oups ! Une erreur s&apos;est produite
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-4">
                  Nous rencontrons un problème inattendu. Veuillez réessayer ou contacter le support si le problème persiste.
                </p>

                {/* Error Details (collapsible in production) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="w-full mb-4 p-3 bg-muted rounded-lg text-left overflow-auto max-h-32">
                    <p className="text-sm font-mono text-destructive">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Accueil
                  </Button>
                </div>

                {/* Report Error */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReportError}
                  className="mt-4 text-muted-foreground"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Signaler l&apos;erreur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for ErrorBoundary
 * Use this for simpler error handling with custom fallbacks
 */
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erreur</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || "Une erreur s'est produite"}
            </p>
            <Button onClick={resetError} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook for error boundary in functional components
 * Note: This is a workaround - class components are still required for actual error catching
 */
export function useErrorBoundary() {
  const triggerError = (error: Error) => {
    throw error;
  };

  return { triggerError };
}
