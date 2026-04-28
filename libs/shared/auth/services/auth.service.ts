import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthState, User } from '../../types';

/**
 * Central Authentication Service
 * Shared across Shell and all remote applications
 *
 * Provides:
 * - Authentication state management
 * - Role and permission checking
 * - Token management
 * - Login/logout operations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    tokenExpiresAt: null,
    authMethod: 'bearer'
  });

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from storage (localStorage or sessionStorage)
   */
  private initializeAuthState(): void {
    const stored = this.getStoredAuthState();
    if (stored && this.isTokenValid(stored.tokenExpiresAt)) {
      this.authState$.next(stored);
    }
  }

  /**
   * Get current authentication state as Observable
   */
  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  /**
   * Get current authentication state synchronously
   */
  getCurrentAuthState(): AuthState {
    return this.authState$.value;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.authState$.value.user;
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.authState$.value.user;
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | undefined {
    return this.authState$.value.user ?? undefined;
  }

  /**
   * Get current bearer token
   */
  getToken(): string | undefined {
    const token = this.authState$.value.token;
    if (token && this.isTokenValid(this.authState$.value.tokenExpiresAt)) {
      return token;
    }
    return undefined;
  }

  /**
   * Set authentication state after successful login
   */
  setAuthState(authState: AuthState): void {
    this.authState$.next(authState);
    this.storeAuthState(authState);
  }

  /**
   * Logout and clear authentication state
   */
  logout(): Observable<void> {
    // In a real implementation, this would call an API endpoint
    this.authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      tokenExpiresAt: null
    });
    this.clearStoredAuthState();
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Check if token is still valid
   */
  isTokenValid(expiresAt: number | null): boolean {
    if (!expiresAt) return false;
    return Date.now() < expiresAt;
  }

  // ========================================================================
  // Local Storage Management
  // ========================================================================

  private getStoredAuthState(): AuthState | null {
    try {
      const stored = localStorage.getItem('auth_state');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private storeAuthState(authState: AuthState): void {
    try {
      localStorage.setItem('auth_state', JSON.stringify(authState));
    } catch (e) {
      console.error('Failed to store auth state', e);
    }
  }

  private clearStoredAuthState(): void {
    try {
      localStorage.removeItem('auth_state');
    } catch (e) {
      console.error('Failed to clear auth state', e);
    }
  }
}
