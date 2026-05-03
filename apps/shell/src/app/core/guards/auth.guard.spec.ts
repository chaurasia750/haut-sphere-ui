import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore, RoleId } from '@libs/shared/auth';

describe('RoleGuard (authGuard)', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authStoreSpy = jasmine.createSpyObj('AuthStore', ['isAuthenticated', 'roleId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStoreSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authStore = TestBed.inject(AuthStore) as jasmine.SpyObj<AuthStore>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('allows authenticated user with a matching role', () => {
    authStore.isAuthenticated.and.returnValue(true);
    authStore.roleId.and.returnValue(RoleId.ADMIN);

    const allowed = TestBed.runInInjectionContext(() =>
      authGuard({ data: { roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] } } as any, { url: '/admin' } as any)
    );

    expect(allowed).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects to login when unauthenticated', () => {
    authStore.isAuthenticated.and.returnValue(false);

    const allowed = TestBed.runInInjectionContext(() =>
      authGuard({ data: { roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] } } as any, { url: '/admin' } as any)
    );

    expect(allowed).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/admin' },
    });
  });

  it('redirects to unauthorized when role does not match', () => {
    authStore.isAuthenticated.and.returnValue(true);
    authStore.roleId.and.returnValue(RoleId.MEMBER);

    const allowed = TestBed.runInInjectionContext(() =>
      authGuard({ data: { roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] } } as any, { url: '/admin' } as any)
    );

    expect(allowed).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/error/unauthorized']);
  });

  it('allows authenticated user when no role restriction is configured', () => {
    authStore.isAuthenticated.and.returnValue(true);
    authStore.roleId.and.returnValue(RoleId.MANAGER);

    const allowed = TestBed.runInInjectionContext(() =>
      authGuard({ data: {} } as any, { url: '/dashboard' } as any)
    );

    expect(allowed).toBe(true);
  });
});
