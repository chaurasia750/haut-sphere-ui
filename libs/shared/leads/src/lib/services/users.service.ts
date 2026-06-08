import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { User } from '../models/user.model';

export const USERS_API_BASE_URL = new InjectionToken<string>('USERS_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/users`,
});

export const USERS_SERVICE = new InjectionToken<IUsersService>('USERS_SERVICE', {
  factory: () => inject(UsersService),
});

export interface IUsersService {
  getUsers(): Observable<User[]>;
}

@Injectable({ providedIn: 'root' })
export class UsersService implements IUsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(USERS_API_BASE_URL);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
}
