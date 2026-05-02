import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse, RoleId } from './models';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('login', () => {
    it('should submit email and password to backend', () => {
      const testResponse: AuthResponse = {
        roleId: RoleId.ADMIN,
        userId: 'user-123',
        expiresIn: 1800
      };

      service.login('test@example.com', 'password123').subscribe((response) => {
        expect(response).toEqual(testResponse);
      });

      const req = httpTestingController.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });

      req.flush(testResponse);
    });

    it('should set session state on successful login', (done) => {
      const testResponse: AuthResponse = {
        roleId: RoleId.MEMBER,
        userId: 'user-456',
        expiresIn: 1800
      };

      service.login('member@example.com', 'password123').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getCurrentRole()).toBe(RoleId.MEMBER);
        expect(service.getCurrentUserId()).toBe('user-456');
        done();
      });

      const req = httpTestingController.expectOne('/api/auth/login');
      req.flush(testResponse);
    });

    it('should clear session on login error', (done) => {
      service.login('invalid@example.com', 'wrongpassword').subscribe(
        () => expect.fail('should not succeed'),
        () => {
          expect(service.isAuthenticated()).toBe(false);
          done();
        }
      );

      const req = httpTestingController.expectOne('/api/auth/login');
      req.error(new ProgressEvent('error'), { status: 401 });
    });

    it('should reject invalid role IDs', (done) => {
      const invalidResponse = {
        roleId: 99,
        userId: 'user-invalid',
        expiresIn: 1800
      };

      service.login('test@example.com', 'password').subscribe(
        () => expect.fail('should reject invalid role'),
        () => {
          expect(service.isAuthenticated()).toBe(false);
          done();
        }
      );

      const req = httpTestingController.expectOne('/api/auth/login');
      req.flush(invalidResponse);
    });
  });

  describe('logout', () => {
    it('should clear session on logout', (done) => {
      // Set up authenticated session first
      const loginResponse: AuthResponse = {
        roleId: RoleId.ADMIN,
        userId: 'user-123',
        expiresIn: 1800
      };

      service.login('admin@example.com', 'password').subscribe(() => {
        service.logout().subscribe(() => {
          expect(service.isAuthenticated()).toBe(false);
          expect(service.getCurrentRole()).toBeNull();
          done();
        });

        const logoutReq = httpTestingController.expectOne('/api/auth/logout');
        expect(logoutReq.request.method).toBe('POST');
        logoutReq.flush(null);
      });

      const loginReq = httpTestingController.expectOne('/api/auth/login');
      loginReq.flush(loginResponse);
    });
  });

  describe('session queries', () => {
    it('should return false for isAuthenticated when no session', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return null for getCurrentRole when not authenticated', () => {
      expect(service.getCurrentRole()).toBeNull();
    });

    it('should return null for getCurrentUserId when not authenticated', () => {
      expect(service.getCurrentUserId()).toBeNull();
    });

    it('should provide observable of session state', (done) => {
      service.getSession$().subscribe((session) => {
        if (session) {
          expect(session.roleId).toBe(RoleId.ADMIN);
          expect(session.userId).toBe('user-123');
          expect(session.isAuthenticated).toBe(true);
          done();
        }
      });

      const validateReq = httpTestingController.expectOne('/api/auth/validate');
      validateReq.flush({
        roleId: RoleId.ADMIN,
        userId: 'user-123',
        expiresIn: 1800
      });
    });
  });
});
