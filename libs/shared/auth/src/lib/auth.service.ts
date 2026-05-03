import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest, AuthResponse, Session, ValidRoleId } from './models';
import { AuthStore } from './auth-store';

/**
 * AuthService - Centralized authentication and session management
 * Handles login, session validation, token refresh, and logout
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(AuthStore);

  /**
   * Authenticate user with email/password credentials
   * @param email - User email
   * @param password - User password
   * @returns Observable of AuthResponse containing roleId and userId
   */
  login(userName: string, password: string, keepMeSignedIn = false): Observable<AuthResponse> {
    const payload: AuthRequest = { userName, password, keepMeSignedIn };
    return this.store.login(payload);
  }

  /**
   * Logout current user and clear session
   * @returns Observable of logout completion
   */
  logout(): Observable<void> {
    return this.store.logout();
  }

  /**
   * Get observable of current session state
   * @returns Observable<Session | null>
   */
  getSession$(): Observable<Session | null> {
    return this.store.session$;
  }

  /**
   * Check if user is currently authenticated
   * @returns true if session exists and is valid
   */
  isAuthenticated(): boolean {
    return this.store.isAuthenticated();
  }

  /**
   * Get current user's role ID
   * @returns Role ID or null if not authenticated
   */
  getCurrentRole(): ValidRoleId | null {
    return this.store.roleId();
  }

  /**
   * Get current user ID
   * @returns User ID or null if not authenticated
   */
  getCurrentUserId(): string | null {
    return this.store.userId();
  }
}
