import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/ui/button";

export type ErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-xl w-full space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          An unexpected error was thrown while rendering this page.
        </p>
        <pre className="text-left text-xs text-destructive bg-muted rounded-md p-3 overflow-auto max-h-64">
          {error.message}
        </pre>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (props: ErrorFallbackProps) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: ReadonlyArray<unknown>;
};

type ErrorBoundaryState = { error: Error | null };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    if (import.meta.env.DEV) {
      console.error("[error-boundary]", error, info);
    }
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error === null) return;
    const prev = prevProps.resetKeys ?? [];
    const next = this.props.resetKeys ?? [];
    if (
      prev.length !== next.length ||
      prev.some((key, i) => !Object.is(key, next[i]))
    ) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  override render() {
    const { error } = this.state;
    if (error) {
      const fallback = this.props.fallback ?? ErrorFallback;
      return fallback({ error, reset: this.reset });
    }
    return this.props.children;
  }
}
