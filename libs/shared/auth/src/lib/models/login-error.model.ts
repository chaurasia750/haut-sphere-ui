/**
 * Login error representation
 */

export interface LoginError {
  code: string;
  message: string;
  userMessage: string;
  statusCode?: number;
  timestamp: Date;
}

export enum LoginErrorCode {
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDS',
  BAD_REQUEST = 'AUTH_BAD_REQUEST',
  SERVER_ERROR = 'AUTH_SERVER_ERROR',
  INVALID_ROLE = 'AUTH_INVALID_ROLE',
  FORM_VALIDATION = 'FORM_VALIDATION',
  UNKNOWN = 'AUTH_UNKNOWN'
}

export const loginErrorMessages: Record<LoginErrorCode, string> = {
  [LoginErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [LoginErrorCode.BAD_REQUEST]: 'Please check your email and password',
  [LoginErrorCode.SERVER_ERROR]: 'System unavailable. Please try again later',
  [LoginErrorCode.INVALID_ROLE]: 'Unable to access system at this time',
  [LoginErrorCode.FORM_VALIDATION]: 'Please correct the errors below',
  [LoginErrorCode.UNKNOWN]: 'An unexpected error occurred'
};
