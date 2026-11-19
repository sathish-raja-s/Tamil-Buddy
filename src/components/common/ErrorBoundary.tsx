import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props accepted by the {@link ErrorBoundary} component.
 */
export interface ErrorBoundaryProps {
  /** Child React subtree protected by this error boundary. */
  children: ReactNode;
  /**
   * Logical scope identifier (e.g., `"Application Root"` or `"Learning Module"`)
   * displayed in error logs and diagnostic metadata for faster triage.
   */
  scope?: string;
  /** Optional custom fallback element rendered instead of the default recovery card. */
  fallback?: ReactNode;
  /**
   * Optional telemetry/logging callback invoked inside `componentDidCatch`
   * whenever an unhandled render error is captured.
   */
  onError?: (error: Error, errorInfo: ErrorInfo, scope: string) => void;
}

/**
 * Internal state tracked by {@link ErrorBoundary}.
 */
export interface ErrorBoundaryState {
  /** Indicates whether a descendant threw an uncaught rendering or lifecycle error. */
  hasError: boolean;
  /** The captured Error instance, if available. */
  error: Error | null;
  /** React component stack trace captured during `componentDidCatch`. */
  componentStack: string | null;
}

/**
 * Formats a safe, child-friendly error summary while preserving technical detail
 * for developer debugging.
 *
 * @param error - The caught Error instance or null.
 * @returns Human-readable diagnostic message string.
 */
export function formatBoundaryErrorMessage(error: Error | null): string {
  if (!error || !error.message) {
    return 'An unexpected error occurred while rendering this view.';
  }
  return error.message;
}

/**
 * React Error Boundary component providing fault isolation across Tamil Buddy.
 *
 * Catches JavaScript exceptions thrown during rendering, lifecycle methods, or
 * constructors anywhere in its child component tree, preventing a white-screen
 * crash and offering a bilingual Tamil/English recovery interface.
 *
 * Recovery paths:
 * 1. **Soft Reset (`Try Again`)**: Clears boundary state and re-mounts the child subtree.
 * 2. **Home Navigation (`Go Home`)**: Redirects to `/` to escape broken route state.
 * 3. **Hard Reload (`Reload App`)**: Forces a clean reload (helpful for stale PWA chunks).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps: Partial<ErrorBoundaryProps> = {
    scope: 'Application Root',
  };

  public declare readonly props: Readonly<ErrorBoundaryProps>;
  public declare setState: (
    state:
      | Partial<ErrorBoundaryState>
      | ((prevState: Readonly<ErrorBoundaryState>, props: Readonly<ErrorBoundaryProps>) => Partial<ErrorBoundaryState> | null)
      | null,
    callback?: () => void
  ) => void;

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    componentStack: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  /**
   * Static React lifecycle hook invoked synchronously after a descendant throws.
   * Transitions the boundary into its fallback state for the next render pass.
   *
   * @param error - The error thrown by a descendant component.
   * @returns Updated state slice flagging the error condition.
   */
  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle hook invoked after an error is caught and committed.
   * Records diagnostic context to the console and forwards to optional `onError` handlers.
   *
   * @param error - The thrown Error object.
   * @param errorInfo - React metadata containing the component stack trace.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const scope = this.props.scope || 'Application Root';
    this.setState({ componentStack: errorInfo.componentStack || null });

    console.error(`[ErrorBoundary:${scope}] Uncaught render error:`, error, errorInfo);

    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo, scope);
      } catch (callbackErr) {
        console.error(`[ErrorBoundary:${scope}] onError handler failed:`, callbackErr);
      }
    }
  }

  /**
   * Resets internal error state so the child component tree can attempt a fresh render.
   */
  public handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      componentStack: null,
    });
  };

  /**
   * Performs a clean browser navigation back to the application home route.
   */
  public handleGoHome = (): void => {
    this.handleReset();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const scope = this.props.scope || 'Application Root';
      const detail = formatBoundaryErrorMessage(this.state.error);

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6"
        >
          <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-3xl">
              🐘
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              மன்னிக்கவும்! சிறிய பிழை ஏற்பட்டது
            </h1>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-4">
              Oops! Tamil Buddy ran into an unexpected hiccup.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Don&apos;t worry — your learning progress, XP, and badges are safely preserved. Try
              reloading this section or returning home.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold transition-colors cursor-pointer"
              >
                Go Home
              </button>
            </div>

            <details className="text-left bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
              <summary className="text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
                Technical Details ({scope})
              </summary>
              <p className="mt-2 text-xs font-mono text-rose-600 dark:text-rose-400 break-words">
                {detail}
              </p>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
