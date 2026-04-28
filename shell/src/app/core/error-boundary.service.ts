import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorDetails {
  remoteApp?: string;
  error: Error | string;
  errorCode?: string;
  timestamp: number;
  userId?: string;
  userAction?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorBoundaryService {
  private errors$ = new BehaviorSubject<ErrorDetails | null>(null);
  private hasError$ = new BehaviorSubject<boolean>(false);

  getError(): Observable<ErrorDetails | null> {
    return this.errors$.asObservable();
  }

  hasError(): Observable<boolean> {
    return this.hasError$.asObservable();
  }

  captureError(
    error: Error | string,
    context?: {
      remoteApp?: string;
      userId?: string;
      userAction?: string;
    }
  ): void {
    const errorDetails: ErrorDetails = {
      error: error instanceof Error ? error.message : error,
      timestamp: Date.now(),
      ...context,
    };

    this.errors$.next(errorDetails);
    this.hasError$.next(true);

    // Log to Sentry (stub)
    this.logToSentry(errorDetails);

    console.error('Error captured by boundary:', errorDetails);
  }

  clearError(): void {
    this.errors$.next(null);
    this.hasError$.next(false);
  }

  private logToSentry(errorDetails: ErrorDetails): void {
    // TODO: Implement actual Sentry integration
    // Example:
    // Sentry.captureException(errorDetails.error, {
    //   tags: {
    //     remoteApp: errorDetails.remoteApp,
    //   },
    //   contexts: {
    //     user: {
    //       id: errorDetails.userId,
    //     },
    //   },
    // });
  }

  retry(): void {
    this.clearError();
    // Trigger retry logic (usually page reload or navigation)
    window.location.reload();
  }
}
