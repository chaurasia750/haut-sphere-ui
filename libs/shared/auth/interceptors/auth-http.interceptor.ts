import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../../errors/error-handler.service';
import { LoggingService } from '../../logging/logging.service';
import { RemoteError } from '../../types';
import { Router } from '@angular/router';

/**
 * HTTP Interceptor for Authentication
 * 
 * Responsibilities:
 * - Add Authorization Bearer token to all requests
 * - Handle 401 (Unauthorized) responses
 * - Log HTTP errors
 * 
 * Usage in AppModule:
 * {
 *   provide: HTTP_INTERCEPTORS,
 *   useClass: AuthHttpInterceptor,
 *   multi: true
 * }
 */
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private logger: LoggingService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add Authorization header with bearer token
    const token = this.authService.getToken();
    if (token && !this.isAuthRequest(request)) {
      request = this.addTokenToRequest(request, token);
    }

    this.logger.debug(`HTTP ${request.method} ${request.url}`);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, request);
      }),
      finalize(() => {
        // Optional: Log request completion
      })
    );
  }

  /**
   * Add Authorization bearer token to request headers
   */
  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>
  ): Observable<never> {
    let remoteError: RemoteError;

    // Determine error type
    if (error.status === 0) {
      // Network error
      remoteError = {
        type: 'network',
        remoteKey: this.extractRemoteKey(request.url),
        recoverable: true,
        suggestedAction: 'Check your network connection and try again',
        timestamp: Date.now(),
        originalError: error.error,
        context: {
          url: request.url,
          method: request.method
        }
      };
      this.logger.error('Network error', remoteError.context);
    } else if (error.status === 401) {
      // Unauthorized - token expired or invalid
      remoteError = {
        type: 'auth_error',
        remoteKey: 'shell',
        recoverable: false,
        suggestedAction: 'Please log in again',
        timestamp: Date.now(),
        originalError: error.error,
        context: {
          status: error.status,
          url: request.url
        }
      };
      this.logger.warn('Unauthorized (401)', remoteError.context);
      
      // Logout and redirect to login
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    } else if (error.status === 403) {
      // Forbidden - user lacks permission
      remoteError = {
        type: 'auth_error',
        remoteKey: 'shell',
        recoverable: true,
        suggestedAction: 'You do not have permission to access this resource',
        timestamp: Date.now(),
        originalError: error.error,
        context: {
          status: error.status,
          url: request.url
        }
      };
      this.logger.warn('Forbidden (403)', remoteError.context);
    } else if (error.status >= 500) {
      // Server error
      remoteError = {
        type: 'runtime_error',
        remoteKey: this.extractRemoteKey(request.url),
        recoverable: true,
        suggestedAction: 'The server is experiencing issues. Please try again later',
        timestamp: Date.now(),
        originalError: error.error,
        context: {
          status: error.status,
          message: error.message,
          url: request.url
        }
      };
      this.logger.error('Server error', remoteError.context);
    } else {
      // Client error (4xx)
      remoteError = {
        type: 'runtime_error',
        remoteKey: this.extractRemoteKey(request.url),
        recoverable: true,
        suggestedAction: error.error?.message || 'Please check your input and try again',
        timestamp: Date.now(),
        originalError: error.error,
        context: {
          status: error.status,
          message: error.message,
          url: request.url
        }
      };
      this.logger.warn('Client error', remoteError.context);
    }

    // Delegate to error handler
    this.errorHandler.handle(remoteError);

    // Propagate error
    return throwError(() => remoteError);
  }

  /**
   * Check if this is an authentication request (avoid infinite loops)
   */
  private isAuthRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('/login') || request.url.includes('/auth');
  }

  /**
   * Extract remote key from URL for context
   */
  private extractRemoteKey(url: string): string {
    // Try to extract from URL pattern like /admin/api, /member/api, etc.
    const match = url.match(/\/(admin|member|management|shell)\//);
    return match ? match[1] : 'unknown';
  }
}
