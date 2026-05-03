import { inject, Injectable } from '@angular/core';
import { AUTH_COOKIE_CONFIG } from './auth-cookie.config';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionPreferencesService {
  private readonly cookieConfig = inject(AUTH_COOKIE_CONFIG);

  private get sessionHintKey(): string {
    return `binsera.auth.session.${this.cookieConfig.accessToken}`;
  }

  private get persistSessionKey(): string {
    return `binsera.auth.persist.${this.cookieConfig.refreshToken}`;
  }

  hasSessionHint(): boolean {
    try {
      return globalThis.localStorage?.getItem(this.sessionHintKey) === '1';
    } catch {
      return false;
    }
  }

  setSessionHint(): void {
    try {
      globalThis.localStorage?.setItem(this.sessionHintKey, '1');
    } catch {
      // Ignore storage access issues in restricted browser contexts
    }
  }

  clearSessionHint(): void {
    try {
      globalThis.localStorage?.removeItem(this.sessionHintKey);
    } catch {
      // Ignore storage access issues in restricted browser contexts
    }
  }

  isPersistentSession(): boolean {
    try {
      return globalThis.localStorage?.getItem(this.persistSessionKey) === '1';
    } catch {
      return false;
    }
  }

  setPersistentSession(enabled: boolean): void {
    try {
      if (enabled) {
        globalThis.localStorage?.setItem(this.persistSessionKey, '1');
      } else {
        globalThis.localStorage?.removeItem(this.persistSessionKey);
      }
    } catch {
      // Ignore storage access issues in restricted browser contexts
    }
  }

  clearPersistentSession(): void {
    try {
      globalThis.localStorage?.removeItem(this.persistSessionKey);
    } catch {
      // Ignore storage access issues in restricted browser contexts
    }
  }
}
