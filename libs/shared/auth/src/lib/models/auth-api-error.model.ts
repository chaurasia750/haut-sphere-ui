export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DISABLED'
  | 'SESSION_EXPIRED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface AuthApiError {
  status: number;
  code: AuthErrorCode;
  message: string;
  userMessage: string;
}
