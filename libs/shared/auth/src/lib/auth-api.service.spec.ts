import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthApiService, AUTH_API_BASE_URL } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthApiService,
        {
          provide: AUTH_API_BASE_URL,
          useValue: '/auth',
        },
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('calls login endpoint with withCredentials', () => {
    service.login({ email: 'user@example.com', password: 'pass' }).subscribe();

    const req = httpTestingController.expectOne('/auth');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ roleId: 2, userId: 'u-1', expiresIn: 1800 });
  });

  it('calls validate endpoint with withCredentials', () => {
    service.validateSession().subscribe();

    const req = httpTestingController.expectOne('/auth/validate');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ roleId: 2, userId: 'u-1', expiresIn: 1800 });
  });

  it('calls refresh endpoint with withCredentials', () => {
    service.refreshSession().subscribe();

    const req = httpTestingController.expectOne('/auth/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ roleId: 2, userId: 'u-1', expiresIn: 1800 });
  });

  it('calls logout endpoint with withCredentials', () => {
    service.logout().subscribe();

    const req = httpTestingController.expectOne('/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null);
  });
});
