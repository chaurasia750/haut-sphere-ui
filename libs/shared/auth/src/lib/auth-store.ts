import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthRequest, AuthResponse, AuthState, Session, ValidRoleId, isValidRole } from './models';
import { AuthApiError } from './models/auth-api-error.model';
import { RoleId } from './models/role.enum';

const INITIAL_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  userId: null,
  roleId: null,
  roleName: null,
  expiresIn: 0,
  status: 'idle',
  errorMessage: null,
  blocked: false,
};

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const LEGACY_REFRESH_TOKEN_COOKIE_NAME = 'binsera_refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly api = inject(AuthApiService);
  private readonly state = signal<AuthState>(INITIAL_AUTH_STATE);
  private refreshInFlight$: Observable<void> | null = null;

  readonly authState = computed(() => this.state());
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly roleId = computed(() => this.state().roleId);
  readonly roleName = computed(() => this.state().roleName);
  readonly userId = computed(() => this.state().userId);
  readonly session = computed<Session | null>(() => {
    const current = this.state();
    if (!current.isAuthenticated || !current.userId || !current.roleId || current.expiresIn <= 0) {
      return null;
    }

    return {
      userId: current.userId,
      roleId: current.roleId,
      isAuthenticated: true,
      expiresAt: Date.now() + current.expiresIn * 1000,
      lastActivity: Date.now(),
    };
  });

  readonly authState$ = toObservable(this.authState);
  readonly session$ = toObservable(this.session);

  initializeSession(): Observable<void> {
    this.patch({ status: 'loading', errorMessage: null, blocked: false });

    return this.api.validateSession().pipe(
      tap((response) => this.setAuthenticatedState(response)),
      map(() => void 0),
      catchError((error) => {
        this.handleValidationError(error);
        return of(void 0);
      })
    );
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    this.patch({ status: 'loading', errorMessage: null, blocked: false });

    return this.api.login(credentials).pipe(
      switchMap(() => this.api.validateSession()),
      tap((response) => this.setAuthenticatedState(response)),
      catchError((error) => {
        this.applyErrorState(error);
        return throwError(() => error);
      })
    );
  }

  refreshSession(): Observable<void> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.api.refreshSession().pipe(
      switchMap(() => this.api.validateSession()),
      tap((response) => this.setAuthenticatedState(response)),
      map(() => void 0),
      catchError((error) => {
        this.setUnauthenticated();
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.refreshInFlight$;
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(
      tap(() => this.setUnauthenticated()),
      catchError(() => {
        this.setUnauthenticated();
        return of(void 0);
      })
    );
  }

  setUnauthenticated(message: string | null = null): void {
    this.state.set({
      ...INITIAL_AUTH_STATE,
      status: 'unauthenticated',
      errorMessage: message,
    });
  }

  private patch(partial: Partial<AuthState>): void {
    this.state.update((prev) => ({ ...prev, ...partial }));
  }

  private setAuthenticatedState(response: AuthResponse): void {
    if (!isValidRole(response.roleId)) {
      this.state.set({
        ...INITIAL_AUTH_STATE,
        status: 'error',
        errorMessage: 'Unable to access system at this time',
      });
      return;
    }

    this.state.set({
      isAuthenticated: true,
      userId: response.userId,
      roleId: response.roleId as ValidRoleId,
      roleName: this.toRoleName(response.roleId as ValidRoleId),
      expiresIn: response.expiresIn,
      status: 'authenticated',
      errorMessage: null,
      blocked: false,
    });
  }

  private handleValidationError(error: unknown): void {
    const parsed = this.parseError(error);

    if (parsed.status === 401) {
      this.setUnauthenticated();
      return;
    }

    if (parsed.status === 403) {
      this.state.set({
        ...INITIAL_AUTH_STATE,
        status: 'error',
        blocked: true,
        errorMessage: parsed.userMessage,
      });
      return;
    }

    this.state.set({
      ...INITIAL_AUTH_STATE,
      status: 'error',
      errorMessage: parsed.userMessage,
    });
  }

  private applyErrorState(error: unknown): void {
    const parsed = this.parseError(error);
    this.state.set({
      ...INITIAL_AUTH_STATE,
      status: parsed.status === 401 ? 'unauthenticated' : 'error',
      blocked: parsed.status === 403,
      errorMessage: parsed.userMessage,
    });
  }

  private parseError(error: unknown): AuthApiError {
    if (!(error instanceof HttpErrorResponse)) {
      return {
        status: 0,
        code: 'UNKNOWN',
        message: 'Unknown authentication error',
        userMessage: 'Unable to sign in right now. Please try again.',
      };
    }

    if (error.status === 401) {
      return {
        status: 401,
        code: 'INVALID_CREDENTIALS',
        message: error.message,
        userMessage: 'Invalid email or password.',
      };
    }

    if (error.status === 403) {
      return {
        status: 403,
        code: 'ACCOUNT_DISABLED',
        message: error.message,
        userMessage: 'Your account is disabled. Please contact support.',
      };
    }

    if (error.status >= 500) {
      return {
        status: error.status,
        code: 'SERVER_ERROR',
        message: error.message,
        userMessage: 'System unavailable. Please try again later.',
      };
    }

    return {
      status: error.status,
      code: 'UNKNOWN',
      message: error.message,
      userMessage: 'Unable to complete authentication request.',
    };
  }

  private toRoleName(roleId: ValidRoleId): string {
    switch (roleId) {
      case RoleId.SYSTEM_ADMIN:
        return 'SYSTEM_ADMIN';
      case RoleId.ADMIN:
        return 'ADMIN';
      case RoleId.MEMBER:
        return 'MEMBER';
      case RoleId.MANAGER:
        return 'MANAGER';
      default:
        return 'UNKNOWN';
    }
  }

}
