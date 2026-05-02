import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginErrorCode, loginErrorMessages } from '@libs/shared/auth';

/**
 * LoginErrorService - Maps backend errors to user-friendly messages
 */
@Injectable({
  providedIn: 'root'
})
export class LoginErrorService {
  /**
   * Map HTTP error to user-friendly message
   */
  mapErrorToUserMessage(error: any): string {
    if (!error) {
      return loginErrorMessages[LoginErrorCode.UNKNOWN];
    }

    const status = error.status;

    if (status === 401) {
      return loginErrorMessages[LoginErrorCode.INVALID_CREDENTIALS];
    }

    if (status === 400) {
      return loginErrorMessages[LoginErrorCode.BAD_REQUEST];
    }

    if (status >= 500) {
      return loginErrorMessages[LoginErrorCode.SERVER_ERROR];
    }

    return loginErrorMessages[LoginErrorCode.UNKNOWN];
  }

  /**
   * Map HTTP error to error code
   */
  mapErrorToCode(error: any): LoginErrorCode {
    if (!error) {
      return LoginErrorCode.UNKNOWN;
    }

    const status = error.status;

    switch (status) {
      case 401:
        return LoginErrorCode.INVALID_CREDENTIALS;
      case 400:
        return LoginErrorCode.BAD_REQUEST;
      case 500:
      case 502:
      case 503:
      case 504:
        return LoginErrorCode.SERVER_ERROR;
      default:
        return LoginErrorCode.UNKNOWN;
    }
  }

  /**
   * Check if error is a retry-able error
   */
  isRetryable(error: any): boolean {
    if (!error) return false;
    const status = error.status;
    // Retry on 5xx errors and network timeouts
    return status >= 500 || status === 0;
  }

  /**
   * Get specific error details from response
   */
  getErrorDetails(error: any): { code: string; details: string } {
    const errorResponse = error.error || {};
    return {
      code: errorResponse.code || 'UNKNOWN',
      details: errorResponse.message || ''
    };
  }
}
