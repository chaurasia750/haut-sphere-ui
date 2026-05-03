import { Injectable } from '@angular/core';

const AUTO_LOGOUT_BUFFER_SECONDS = 30;

@Injectable({
  providedIn: 'root',
})
export class AuthSessionExpiryService {
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  scheduleAutoLogout(expiresInSeconds: number, autoRefreshEnabled: boolean, onExpire: () => void): void {
    this.cancelAutoLogout();

    if (autoRefreshEnabled) {
      return;
    }

    if (!Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
      return;
    }

    const timeoutSeconds = Math.max(1, expiresInSeconds - AUTO_LOGOUT_BUFFER_SECONDS);
    this.logoutTimer = globalThis.setTimeout(onExpire, timeoutSeconds * 1000);
  }

  cancelAutoLogout(): void {
    if (!this.logoutTimer) {
      return;
    }

    globalThis.clearTimeout(this.logoutTimer);
    this.logoutTimer = null;
  }
}
