import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteError } from '../types';

/**
 * Central Error Handler Service
 * Shared across Shell and all remote applications
 *
 * Provides:
 * - Centralized error handling
 * - Error logging and reporting
 * - User-friendly error display
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly errors$ = new BehaviorSubject<RemoteError | null>(null);
  private readonly errorHistory: RemoteError[] = [];
  private readonly maxHistorySize = 100;

  constructor() {}

  /**
   * Handle a remote error
   */
  handle(error: RemoteError): void {
    console.error('RemoteError:', error);
    this.errors$.next(error);
    this.addToHistory(error);
    this.logError(error);
  }

  /**
   * Show user-friendly error message
   */
  showError(message: string, severity: 'error' | 'warning' | 'info' = 'error'): void {
    const error: RemoteError = {
      type: 'runtime_error',
      remoteKey: 'shell',
      recoverable: true,
      timestamp: Date.now(),
      context: { message, severity }
    };
    this.handle(error);
  }

  /**
   * Get current error as Observable
   */
  errors(): Observable<RemoteError | null> {
    return this.errors$.asObservable();
  }

  /**
   * Get error history (for debugging/analytics)
   */
  getHistory(): RemoteError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory.length = 0;
  }

  // ========================================================================
  // Private Methods
  // ========================================================================

  private addToHistory(error: RemoteError): void {
    this.errorHistory.push(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  private logError(error: RemoteError): void {
    const timestamp = new Date(error.timestamp).toISOString();
    const message = `[${timestamp}] ${error.type} in ${error.remoteKey}: ${error.originalError?.message || 'Unknown error'}`;

    switch (error.type) {
      case 'network':
        console.error('Network Error:', message, error);
        break;
      case 'timeout':
        console.warn('Timeout Error:', message, error);
        break;
      case 'auth_error':
        console.error('Auth Error:', message, error);
        break;
      case 'runtime_error':
        console.error('Runtime Error:', message, error);
        break;
      default:
        console.log(message, error);
    }

    // In production, send to monitoring service
    this.sendToMonitoring(error);
  }

  private sendToMonitoring(error: RemoteError): void {
    // TODO: Implement monitoring service integration
    // This would send errors to a service like Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && (window as any).sentryIntegration) {
      (window as any).sentryIntegration.captureException(error);
    }
  }
}
