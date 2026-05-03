import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AuthStore } from './auth-store';
import { AuthApiService } from './auth-api.service';
import { RoleId } from './models';

describe('AuthStore', () => {
  let store: AuthStore;
  let api: jasmine.SpyObj<AuthApiService>;
  let mockDocument: { cookie: string };

  beforeEach(() => {
    mockDocument = {
      cookie: 'accessToken=token123; refreshToken=refresh123',
    };

    const apiSpy = jasmine.createSpyObj<AuthApiService>('AuthApiService', [
      'login',
      'validateSession',
      'refreshSession',
      'logout',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        {
          provide: AuthApiService,
          useValue: apiSpy,
        },
        {
          provide: DOCUMENT,
          useValue: mockDocument,
        },
      ],
    });

    store = TestBed.inject(AuthStore);
    api = TestBed.inject(AuthApiService) as jasmine.SpyObj<AuthApiService>;
  });

  it('skips validate call when auth cookies are missing', (done) => {
    mockDocument.cookie = '';

    store.initializeSession().subscribe(() => {
      expect(api.validateSession).not.toHaveBeenCalled();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.authState().status).toBe('unauthenticated');
      done();
    });
  });

  it('marks authenticated on initialize when validate returns 200', (done) => {
    api.validateSession.and.returnValue(of({ roleId: RoleId.ADMIN, userId: 'u-1', expiresIn: 1800 }));

    store.initializeSession().subscribe(() => {
      expect(store.isAuthenticated()).toBe(true);
      expect(store.roleId()).toBe(RoleId.ADMIN);
      expect(store.roleName()).toBe('ADMIN');
      done();
    });
  });

  it('calls validate when legacy refresh cookie exists', (done) => {
    mockDocument.cookie = 'accessToken=token123; binsera_refresh_token=legacy123';
    api.validateSession.and.returnValue(of({ roleId: RoleId.ADMIN, userId: 'u-legacy', expiresIn: 1800 }));

    store.initializeSession().subscribe(() => {
      expect(api.validateSession).toHaveBeenCalledTimes(1);
      expect(store.isAuthenticated()).toBe(true);
      done();
    });
  });

  it('marks unauthenticated silently when validate returns 401', (done) => {
    api.validateSession.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
    );

    store.initializeSession().subscribe(() => {
      expect(store.isAuthenticated()).toBe(false);
      expect(store.authState().status).toBe('unauthenticated');
      expect(store.authState().errorMessage).toBeNull();
      done();
    });
  });

  it('sets blocked state when validate returns 403', (done) => {
    api.validateSession.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 403, statusText: 'Forbidden' }))
    );

    store.initializeSession().subscribe(() => {
      expect(store.isAuthenticated()).toBe(false);
      expect(store.authState().blocked).toBe(true);
      expect(store.authState().status).toBe('error');
      done();
    });
  });

  it('logs in and hydrates state via validate', (done) => {
    api.login.and.returnValue(of({ roleId: RoleId.MEMBER, userId: 'u-2', expiresIn: 1800 }));
    api.validateSession.and.returnValue(of({ roleId: RoleId.MEMBER, userId: 'u-2', expiresIn: 1800 }));

    store.login({ email: 'member@example.com', password: 'pass' }).subscribe(() => {
      expect(api.login).toHaveBeenCalled();
      expect(api.validateSession).toHaveBeenCalled();
      expect(store.isAuthenticated()).toBe(true);
      expect(store.roleName()).toBe('MEMBER');
      done();
    });
  });

  it('clears state on logout', (done) => {
    api.logout.and.returnValue(of(void 0));

    store.logout().subscribe(() => {
      expect(store.isAuthenticated()).toBe(false);
      expect(store.authState().status).toBe('unauthenticated');
      done();
    });
  });
});
