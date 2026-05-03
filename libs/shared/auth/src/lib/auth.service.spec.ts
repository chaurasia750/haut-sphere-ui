import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthStore } from './auth-store';
import { AuthResponse, RoleId } from './models';

describe('AuthService', () => {
  let service: AuthService;
  let authStore: any;

  beforeEach(() => {
    const authStoreSpy = {
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: vi.fn(),
      roleId: vi.fn(),
      userId: vi.fn(),
      session$: of(null),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthStore, useValue: authStoreSpy as unknown as AuthStore },
      ]
    });

    service = TestBed.inject(AuthService);
    authStore = authStoreSpy;
  });

  it('delegates login to AuthStore', () => {
    const response: AuthResponse = {
      roleId: RoleId.ADMIN,
      userId: 'user-123',
      expiresIn: 1800,
    };
    authStore.login.mockReturnValue(of(response));

    service.login('test@example.com', 'password').subscribe((result) => {
      expect(result).toEqual(response);
    });

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('delegates logout to AuthStore', () => {
    authStore.logout.mockReturnValue(of(void 0));

    service.logout().subscribe(() => {
      expect(authStore.logout).toHaveBeenCalled();
    });
  });

  it('reads authentication state from store', () => {
    authStore.isAuthenticated.mockReturnValue(true);

    expect(service.isAuthenticated()).toBe(true);
    expect(authStore.isAuthenticated).toHaveBeenCalled();
  });

  it('reads current role and user id from store', () => {
    authStore.roleId.mockReturnValue(RoleId.MEMBER);
    authStore.userId.mockReturnValue('member-22');

    expect(service.getCurrentRole()).toBe(RoleId.MEMBER);
    expect(service.getCurrentUserId()).toBe('member-22');
  });

  it('exposes session observable from store', () => {
      const testResponse: AuthResponse = {
        roleId: RoleId.MANAGER,
        userId: 'u-9',
        expiresIn: 1200,
      };

      authStore.roleId.mockReturnValue(testResponse.roleId);
      authStore.userId.mockReturnValue(testResponse.userId);

      service.getSession$().subscribe((session) => {
        expect(session).toBeNull();
      });
  });
});
