import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthStore } from './auth-store';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let authStore: jasmine.SpyObj<AuthStore>;

  beforeEach(() => {
    const authStoreSpy = jasmine.createSpyObj<AuthStore>('AuthStore', ['refreshSession', 'setUnauthenticated']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/admin' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: AuthStore,
          useValue: authStoreSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore) as jasmine.SpyObj<AuthStore>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('adds withCredentials to outgoing requests', () => {
    http.get('/protected').subscribe();

    const req = httpTestingController.expectOne('/protected');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ ok: true });
  });

  it('refreshes once and retries request on 401', () => {
    authStore.refreshSession.and.returnValue(of(void 0));

    http.get('/protected').subscribe();

    const firstReq = httpTestingController.expectOne('/protected');
    firstReq.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    const retriedReq = httpTestingController.expectOne('/protected');
    expect(retriedReq.request.headers.get('x-auth-refresh-retry')).toBe('1');
    retriedReq.flush({ ok: true });
    expect(authStore.refreshSession).toHaveBeenCalledTimes(1);
  });

  it('does not refresh on auth endpoints', () => {
    authStore.refreshSession.and.returnValue(of(void 0));

    http.get('/auth/validate').subscribe({ error: () => undefined });

    const req = httpTestingController.expectOne('/auth/validate');
    req.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(authStore.refreshSession).not.toHaveBeenCalled();
  });

  it('clears auth state when refresh fails', () => {
    authStore.refreshSession.and.returnValue(
      throwError(() => new Error('refresh failed'))
    );

    http.get('/protected').subscribe({ error: () => undefined });

    const req = httpTestingController.expectOne('/protected');
    req.flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(authStore.setUnauthenticated).toHaveBeenCalled();
  });
});
