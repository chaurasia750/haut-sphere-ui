import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval } from 'rxjs';
import { tap, catchError, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService, AuthResponse, Session, ValidRoleId, isValidRole } from '@libs/shared/auth';

/**
 * SessionService - Manages session persistence, validation, refresh, and timeout
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiUrl = '/api/auth';
  private readonly SESSION_STORAGE_KEY = 'auth_session';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry
  private sessionTimeout$: Observable<void> | null = null;
  private destroy$ = new BehaviorSubject<void>(void 0);

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  /**
   * Initialize session on app startup
   * Validates existing session and sets up auto-refresh
   */
  initializeSession(): Observable<boolean> {
    return this.validateSession().pipe(
      tap((isValid) => {
        if (isValid) {
          this.setupAutoRefresh();
          this.setupSessionTimeout();
        }
      }),
      catchError(() => {
        return new Observable<boolean>((obs) => {
          obs.next(false);
          obs.complete();
        });
      })
    );
  }

  /**
   * Validate current session with backend
   */
  private validateSession(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/validate`).pipe(
      tap((response) => {
        if (isValidRole(response.roleId)) {
          this.updateSession(response);
        }
      }),
      switchMap(() => new Observable<boolean>((obs) => {
        obs.next(true);
        obs.complete();
      })),
      catchError(() => new Observable<boolean>((obs) => {
        obs.next(false);
        obs.complete();
      }))
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response) => {
        this.updateSession(response);
        this.setupAutoRefresh();
      }),
      catchError((error) => {
        this.authService.logout().subscribe();
        throw error;
      })
    );
  }

  /**
   * Update session state
   */
  private updateSession(response: AuthResponse): void {
    const session: Session = {
      userId: response.userId,
      roleId: response.roleId as ValidRoleId,
      isAuthenticated: true,
      expiresAt: Date.now() + response.expiresIn * 1000,
      lastActivity: Date.now()
    };
    localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  /**
   * Get persisted session
   */
  getPersistedSession(): Session | null {
    try {
      const stored = localStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if session is still valid
   */
  isSessionValid(session: Session | null): boolean {
    if (!session) return false;
    return session.expiresAt > Date.now();
  }

  /**
   * Setup auto-refresh of tokens before expiry
   */
  private setupAutoRefresh(): void {
    const session = this.getPersistedSession();
    if (!session) return;

    const expiresIn = session.expiresAt - Date.now();
    const refreshIn = expiresIn - this.REFRESH_BUFFER;

    if (refreshIn > 0) {
      timer(refreshIn)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.refreshToken().subscribe({
            error: () => {
              // Token refresh failed, logout user
              this.authService.logout().subscribe();
            }
          });
        });
    }
  }

  /**
   * Setup session timeout (logout after inactivity)
   */
  private setupSessionTimeout(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const session = this.getPersistedSession();
        if (session && session.expiresAt <= Date.now()) {
          this.authService.logout().subscribe();
        }
      });
  }

  /**
   * Clear session data
   */
  clearSession(): void {
    localStorage.removeItem(this.SESSION_STORAGE_KEY);
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    const session = this.getPersistedSession();
    if (session) {
      session.lastActivity = Date.now();
      this.updateSession({
        roleId: session.roleId,
        userId: session.userId,
        expiresIn: Math.floor((session.expiresAt - Date.now()) / 1000)
      });
    }
  }
}
