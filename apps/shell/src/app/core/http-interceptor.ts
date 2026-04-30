import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Lazy inject authService inside the intercept method to avoid circular dependency issues
    const authService = inject(AuthService);

    // Add request ID header for tracing
    const requestId = this.generateRequestId();
    request = request.clone({
      setHeaders: {
        'X-Request-ID': requestId,
      },
    });

    // Add auth token if available
    return authService.getToken().pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Try to refresh token
          return authService.refreshToken().pipe(
            switchMap((newToken) => {
              const clonedRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(clonedRequest);
            }),
            catchError((refreshError) => {
              // If refresh fails, redirect to login
              console.error('Token refresh failed', refreshError);
              return throwError(() => refreshError);
            })
          );
        }

        // Log error with context
        console.error('HTTP Error:', {
          status: error.status,
          message: error.message,
          url: request.url,
          requestId,
        });

        return throwError(() => error);
      })
    );
  }

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
