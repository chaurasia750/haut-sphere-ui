import { InjectionToken } from '@angular/core';

export interface AuthCookieConfig {
  accessToken: string;
  refreshToken: string;
  legacyRefreshToken: string;
}

export const DEFAULT_AUTH_COOKIE_CONFIG: AuthCookieConfig = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  legacyRefreshToken: 'binsera_refresh_token',
};

export const AUTH_COOKIE_CONFIG = new InjectionToken<AuthCookieConfig>('AUTH_COOKIE_CONFIG', {
  factory: () => DEFAULT_AUTH_COOKIE_CONFIG,
});
