import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LoginErrorService } from './login-error.service';
import { LoginErrorCode } from '@libs/shared/auth';

describe('LoginErrorService', () => {
  let service: LoginErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginErrorService]
    });
    service = TestBed.inject(LoginErrorService);
  });

  describe('mapErrorToUserMessage', () => {
    it('should map 401 to "Invalid email or password"', () => {
      const error = { status: 401 };
      const message = service.mapErrorToUserMessage(error);
      expect(message).toBe('Invalid email or password');
    });

    it('should map 400 to "Please check your email and password"', () => {
      const error = { status: 400 };
      const message = service.mapErrorToUserMessage(error);
      expect(message).toBe('Please check your email and password');
    });

    it('should map 500 to "System unavailable"', () => {
      const error = { status: 500 };
      const message = service.mapErrorToUserMessage(error);
      expect(message).toBe('System unavailable. Please try again later');
    });

    it('should map 502 to generic server error', () => {
      const error = { status: 502 };
      const message = service.mapErrorToUserMessage(error);
      expect(message).toContain('System unavailable');
    });

    it('should handle null error gracefully', () => {
      const message = service.mapErrorToUserMessage(null);
      expect(message).toBe('An unexpected error occurred');
    });

    it('should handle undefined error gracefully', () => {
      const message = service.mapErrorToUserMessage(undefined);
      expect(message).toBe('An unexpected error occurred');
    });
  });

  describe('mapErrorToCode', () => {
    it('should map 401 to INVALID_CREDENTIALS', () => {
      const error = { status: 401 };
      const code = service.mapErrorToCode(error);
      expect(code).toBe(LoginErrorCode.INVALID_CREDENTIALS);
    });

    it('should map 400 to BAD_REQUEST', () => {
      const error = { status: 400 };
      const code = service.mapErrorToCode(error);
      expect(code).toBe(LoginErrorCode.BAD_REQUEST);
    });

    it('should map 500 to SERVER_ERROR', () => {
      const error = { status: 500 };
      const code = service.mapErrorToCode(error);
      expect(code).toBe(LoginErrorCode.SERVER_ERROR);
    });

    it('should map 503 to SERVER_ERROR', () => {
      const error = { status: 503 };
      const code = service.mapErrorToCode(error);
      expect(code).toBe(LoginErrorCode.SERVER_ERROR);
    });

    it('should map unknown status to UNKNOWN', () => {
      const error = { status: 418 }; // I'm a teapot
      const code = service.mapErrorToCode(error);
      expect(code).toBe(LoginErrorCode.UNKNOWN);
    });
  });

  describe('isRetryable', () => {
    it('should return true for 500 errors', () => {
      expect(service.isRetryable({ status: 500 })).toBe(true);
    });

    it('should return true for 502 errors', () => {
      expect(service.isRetryable({ status: 502 })).toBe(true);
    });

    it('should return true for 503 errors', () => {
      expect(service.isRetryable({ status: 503 })).toBe(true);
    });

    it('should return false for 401 errors', () => {
      expect(service.isRetryable({ status: 401 })).toBe(false);
    });

    it('should return false for 400 errors', () => {
      expect(service.isRetryable({ status: 400 })).toBe(false);
    });

    it('should return true for network errors (status 0)', () => {
      expect(service.isRetryable({ status: 0 })).toBe(true);
    });

    it('should return false for null error', () => {
      expect(service.isRetryable(null)).toBe(false);
    });
  });

  describe('getErrorDetails', () => {
    it('should extract error code and message from response', () => {
      const error = {
        error: {
          code: 'AUTH_FAILED',
          message: 'Authentication failed'
        }
      };
      const details = service.getErrorDetails(error);
      expect(details.code).toBe('AUTH_FAILED');
      expect(details.details).toBe('Authentication failed');
    });

    it('should handle missing error response', () => {
      const error = {};
      const details = service.getErrorDetails(error);
      expect(details.code).toBe('UNKNOWN');
      expect(details.details).toBe('');
    });

    it('should provide defaults for partial error response', () => {
      const error = {
        error: {
          code: 'AUTH_FAILED'
        }
      };
      const details = service.getErrorDetails(error);
      expect(details.code).toBe('AUTH_FAILED');
      expect(details.details).toBe('');
    });
  });
});
