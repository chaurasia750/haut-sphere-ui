import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthStore } from './auth-store';

/**
 * HTTP Interceptor for authentication
 * Handles 401 responses and redirects to login if session has expired
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authStore: AuthStore,
  ) {}

  private static readonly RETRY_HEADER = 'x-auth-refresh-retry';

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const credentialRequest = request.clone({ withCredentials: true });

    return next.handle(credentialRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!this.shouldRefresh(error, credentialRequest)) {
          return throwError(() => error);
        }

        return this.authStore.refreshSession().pipe(
          switchMap(() => {
            const retried = credentialRequest.clone({
              headers: credentialRequest.headers.set(AuthInterceptor.RETRY_HEADER, '1'),
              withCredentials: true,
            });
            return next.handle(retried);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            this.authStore.setUnauthenticated();
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url }
            });
            return throwError(() => refreshError);
          })
        );
      })
    );
  }

  private shouldRefresh(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean {
    if (error.status !== 401) {
      return false;
    }

    if (request.headers.has(AuthInterceptor.RETRY_HEADER)) {
      return false;
    }

    return !this.isAuthEndpoint(request.url);
  }

  private isAuthEndpoint(url: string): boolean {
    return /\/auth(\/validate|\/refresh|\/logout)?$/.test(url);
  }
}
