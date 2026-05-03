import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Connection failed. Please check your internet connection and try again.',
  400: 'Invalid request. Please check your input and try again.',
  401: 'Session expired. Please log in again.',
  403: 'Access denied. You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The record may already exist.',
  422: 'Validation failed. Please review the form and try again.',
  500: 'Something went wrong on our end. Please try again later.',
  502: 'Service temporarily unavailable. Please try again shortly.',
  503: 'Service is under maintenance. Please try again later.',
};

function getErrorMessage(error: HttpErrorResponse): string {
  // Network / CORS errors surface as status 0
  if (error.status === 0 || error.error instanceof ProgressEvent) {
    return ERROR_MESSAGES[0];
  }

  // Try to pull a human-readable message from the API response body
  if (error.error && typeof error.error === 'object') {
    const body = error.error as Record<string, unknown>;
    if (typeof body['message'] === 'string' && body['message']) {
      return body['message'];
    }
    if (typeof body['title'] === 'string' && body['title']) {
      return body['title'];
    }
    const nested = body['message'];
    if (nested && typeof nested === 'object' && typeof (nested as any)['message'] === 'string') {
      return (nested as any)['message'];
    }
  }

  return ERROR_MESSAGES[error.status] ?? 'An unexpected error occurred. Please try again.';
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly toastr = inject(ToastrService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => error);
        }

        const message = getErrorMessage(error);
        this.toastr.error(message, 'Error');
        return throwError(() => error);
      }),
    );
  }
}
