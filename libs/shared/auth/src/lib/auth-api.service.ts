import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequest, AuthResponse } from './models';
import { apiConfig } from '@app/shell/environments/api.dev.config';

export const AUTH_API_BASE_URL = new InjectionToken<string>('AUTH_API_BASE_URL', {
  // Fallback keeps auth traffic on backend API even if a remote misses provider wiring.
  factory: () => `${apiConfig.baseUrl}/auth`,
});

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUTH_API_BASE_URL);

  login(payload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl, payload, { withCredentials: true });
  }

  validateSession(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/validate`, { withCredentials: true });
  }

  refreshSession(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}
