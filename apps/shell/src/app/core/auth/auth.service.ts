import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, AuthToken } from './user.model';
import { apiConfig } from '@app/shell/environments/api.dev.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiBaseUrl = apiConfig.baseUrl;
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private token$ = new BehaviorSubject<string | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token$.next(storedToken);
      this.isAuthenticated$.next(true);
    }
  }

  private initializeAuth() {
    // Try to restore session from localStorage
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token$.next(storedToken);
      this.isAuthenticated$.next(true);
    }
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http
      .post<AuthToken>(`${this.apiBaseUrl}/api/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap((authToken) => {
          localStorage.setItem('auth_token', authToken.accessToken);
          this.token$.next(authToken.accessToken);
          this.isAuthenticated$.next(true);
          if (authToken.user) {
            this.currentUser$.next(authToken.user);
          }
        }),
        map((authToken) => authToken.user as User),
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/api/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        this.token$.next(null);
        this.isAuthenticated$.next(false);
        this.currentUser$.next(null);
      }),
      catchError((error) => {
        // Still clear local state even if logout API fails
        localStorage.removeItem('auth_token');
        this.token$.next(null);
        this.isAuthenticated$.next(false);
        this.currentUser$.next(null);
        return of(void 0);
      })
    );
  }

  getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }

  getUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  hasRole(role: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        return user ? user.roles.includes(role) : false;
      })
    );
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<AuthToken>(`${this.apiBaseUrl}/api/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((authToken) => {
          localStorage.setItem('auth_token', authToken.accessToken);
          this.token$.next(authToken.accessToken);
          if (authToken.user) {
            this.currentUser$.next(authToken.user);
          }
        }),
        map((authToken) => authToken.accessToken),
        catchError((error) => {
          // If refresh fails, clear session
          this.logout().subscribe();
          return throwError(() => error);
        })
      );
  }
}
