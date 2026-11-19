import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
  ErrorBoundary,
  formatBoundaryErrorMessage,
} from '../../src/components/common/ErrorBoundary';

/**
 * Unit test suite verifying React ErrorBoundary lifecycle hooks,
 * error message formatting, telemetry callback safety, and soft recovery.
 */
describe('ErrorBoundary Fault-Isolation Unit Tests', () => {
  it('derives error state synchronously via getDerivedStateFromError', () => {
    const sampleError = new Error('Canvas context initialization failed');
    const nextState = ErrorBoundary.getDerivedStateFromError(sampleError);

    expect(nextState.hasError).toBe(true);
    expect(nextState.error).toBe(sampleError);
  });

  it('formats error messages safely for both valid errors and empty inputs', () => {
    expect(formatBoundaryErrorMessage(new Error('Chunk load timeout'))).toBe(
      'Chunk load timeout'
    );
    expect(formatBoundaryErrorMessage(new Error(''))).toBe(
      'An unexpected error occurred while rendering this view.'
    );
    expect(formatBoundaryErrorMessage(null)).toBe(
      'An unexpected error occurred while rendering this view.'
    );
  });

  it('invokes the optional onError callback with error, stack info, and scope', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    const boundary = new ErrorBoundary({
      children: null,
      scope: 'Tracing Canvas',
      onError,
    });
    // Stub setState in non-mounted unit test instance
    boundary.setState = vi.fn();

    const testError = new Error('Stroke render exception');
    const errorInfo = { componentStack: '\n    at WritingPad\n    at Layout' };

    boundary.componentDidCatch(testError, errorInfo);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(testError, errorInfo, 'Tracing Canvas');
    expect(boundary.setState).toHaveBeenCalledWith({
      componentStack: errorInfo.componentStack,
    });

    consoleSpy.mockRestore();
  });

  it('isolates exceptions thrown inside a user-supplied onError handler', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const faultyHandler = vi.fn(() => {
      throw new Error('Telemetry endpoint unreachable');
    });

    const boundary = new ErrorBoundary({
      children: null,
      scope: 'AI Chat',
      onError: faultyHandler,
    });
    boundary.setState = vi.fn();

    expect(() =>
      boundary.componentDidCatch(new Error('Render crash'), { componentStack: '' })
    ).not.toThrow();
    expect(faultyHandler).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('resets boundary state cleanly when handleReset is triggered', () => {
    const boundary = new ErrorBoundary({ children: null });
    const setStateSpy = vi.fn();
    boundary.setState = setStateSpy;

    boundary.handleReset();

    expect(setStateSpy).toHaveBeenCalledWith({
      hasError: false,
      error: null,
      componentStack: null,
    });
  });

  it('renders custom fallback element when provided and in error state', () => {
    const customFallback = React.createElement('div', null, 'Custom Fallback');
    const boundary = new ErrorBoundary({
      children: React.createElement('span', null, 'Child Content'),
      fallback: customFallback,
    });
    boundary.state = {
      hasError: true,
      error: new Error('Failure'),
      componentStack: null,
    };

    expect(boundary.render()).toBe(customFallback);
  });

  it('renders children transparently when no error has occurred', () => {
    const childElement = React.createElement('span', null, 'Healthy Child');
    const boundary = new ErrorBoundary({ children: childElement });

    expect(boundary.render()).toBe(childElement);
  });
});
