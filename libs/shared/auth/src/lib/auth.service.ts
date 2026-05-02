import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthResponse, Session, ValidRoleId, isValidRole } from './models';

/**
 * AuthService - Centralized authentication and session management
 * Handles login, session validation, token refresh, and logout
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private session$ = new BehaviorSubject<Session | null>(null);
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

  constructor(private http: HttpClient) {
    this.validateSession();
  }

  /**
   * Authenticate user with email/password credentials
   * @param email - User email
   * @param password - User password
   * @returns Observable of AuthResponse containing roleId and userId
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          // Validate role ID before updating session
          if (!isValidRole(response.roleId)) {
            throw new Error(`Invalid role ID: ${response.roleId}`);
          }
          
          // Update session state
          this.session$.next({
            userId: response.userId,
            roleId: response.roleId as ValidRoleId,
            isAuthenticated: true,
            expiresAt: Date.now() + response.expiresIn * 1000,
            lastActivity: Date.now()
          });
        }),
        catchError((error) => {
          this.session$.next(null);
          throw error;
        })
      );
  }

  /**
   * Logout current user and clear session
   * @returns Observable of logout completion
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.session$.next(null)),
        catchError((error) => {
          this.session$.next(null);
          return of(void 0);
        })
      );
  }

  /**
   * Get observable of current session state
   * @returns Observable<Session | null>
   */
  getSession$(): Observable<Session | null> {
    return this.session$.asObservable();
  }

  /**
   * Check if user is currently authenticated
   * @returns true if session exists and is valid
   */
  isAuthenticated(): boolean {
    const session = this.session$.value;
    return session?.isAuthenticated ?? false;
  }

  /**
   * Get current user's role ID
   * @returns Role ID or null if not authenticated
   */
  getCurrentRole(): ValidRoleId | null {
    return this.session$.value?.roleId ?? null;
  }

  /**
   * Get current user ID
   * @returns User ID or null if not authenticated
   */
  getCurrentUserId(): string | null {
    return this.session$.value?.userId ?? null;
  }

  /**
   * Validate session state with backend
   * Called on app initialization to restore session if user was previously authenticated
   */
  private validateSession(): void {
    this.http.get<AuthResponse>(`${this.apiUrl}/validate`)
      .pipe(
        tap((response) => {
          if (isValidRole(response.roleId)) {
            this.session$.next({
              userId: response.userId,
              roleId: response.roleId as ValidRoleId,
              isAuthenticated: true,
              expiresAt: Date.now() + response.expiresIn * 1000,
              lastActivity: Date.now()
            });
          }
        }),
        catchError(() => {
          this.session$.next(null);
          return of(null);
        })
      )
      .subscribe();
  }
}
