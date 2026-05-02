import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { AuthService, RoleId } from '@libs/shared/auth';

describe('SessionService', () => {
  let service: SessionService;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SessionService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(SessionService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Session Initialization', () => {
    it('should initialize session on app startup', (done) => {
      service.initializeSession().subscribe((isValid) => {
        expect(isValid).toBe(true);
        done();
      });

      const req = httpMock.expectOne('/api/auth/validate');
      req.flush({
        roleId: RoleId.ADMIN,
        userId: 'user-1',
        expiresIn: 1800
      });
    });

    it('should handle validation failure gracefully', (done) => {
      service.initializeSession().subscribe((isValid) => {
        expect(isValid).toBe(false);
        done();
      });

      const req = httpMock.expectOne('/api/auth/validate');
      req.error(new ProgressEvent('error'), { status: 401 });
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token before expiry', (done) => {
      service.refreshToken().subscribe((response) => {
        expect(response.roleId).toBe(RoleId.ADMIN);
        done();
      });

      const req = httpMock.expectOne('/api/auth/refresh');
      expect(req.request.method).toBe('POST');
      req.flush({
        roleId: RoleId.ADMIN,
        userId: 'user-1',
        expiresIn: 1800
      });
    });

    it('should logout on refresh failure', (done) => {
      authService.logout.and.returnValue(new Observable(() => {}));

      service.refreshToken().subscribe(
        () => expect.fail('should not succeed'),
        () => {
          expect(authService.logout).toHaveBeenCalled();
          done();
        }
      );

      const req = httpMock.expectOne('/api/auth/refresh');
      req.error(new ProgressEvent('error'), { status: 401 });
    });
  });

  describe('Session Persistence', () => {
    it('should persist session to localStorage', () => {
      service['updateSession']({
        roleId: RoleId.ADMIN,
        userId: 'user-1',
        expiresIn: 1800
      });

      const persisted = service.getPersistedSession();
      expect(persisted).toBeDefined();
      expect(persisted?.userId).toBe('user-1');
      expect(persisted?.roleId).toBe(RoleId.ADMIN);
    });

    it('should retrieve persisted session', () => {
      const session = {
        userId: 'user-1',
        roleId: RoleId.MEMBER,
        isAuthenticated: true,
        expiresAt: Date.now() + 1800000,
        lastActivity: Date.now()
      };
      localStorage.setItem('auth_session', JSON.stringify(session));

      const retrieved = service.getPersistedSession();
      expect(retrieved).toEqual(session);
    });

    it('should return null for missing session', () => {
      const session = service.getPersistedSession();
      expect(session).toBeNull();
    });

    it('should clear session from storage', () => {
      localStorage.setItem('auth_session', JSON.stringify({ userId: 'user-1' }));
      service.clearSession();

      const session = service.getPersistedSession();
      expect(session).toBeNull();
    });
  });

  describe('Session Validation', () => {
    it('should validate non-expired session', () => {
      const session = {
        userId: 'user-1',
        roleId: RoleId.ADMIN as any,
        isAuthenticated: true,
        expiresAt: Date.now() + 1800000,
        lastActivity: Date.now()
      };

      expect(service.isSessionValid(session)).toBe(true);
    });

    it('should invalidate expired session', () => {
      const session = {
        userId: 'user-1',
        roleId: RoleId.ADMIN as any,
        isAuthenticated: true,
        expiresAt: Date.now() - 1000, // Expired 1 second ago
        lastActivity: Date.now()
      };

      expect(service.isSessionValid(session)).toBe(false);
    });

    it('should return false for null session', () => {
      expect(service.isSessionValid(null)).toBe(false);
    });
  });

  describe('Activity Tracking', () => {
    it('should update last activity timestamp', () => {
      service['updateSession']({
        roleId: RoleId.ADMIN,
        userId: 'user-1',
        expiresIn: 1800
      });

      const oldSession = service.getPersistedSession();
      const oldActivity = oldSession?.lastActivity;

      // Wait a bit and update
      setTimeout(() => {
        service.updateActivity();
        const newSession = service.getPersistedSession();
        expect(newSession?.lastActivity).toBeGreaterThan(oldActivity || 0);
      }, 100);
    });
  });
});

// Mock Observable for testing
import { Observable } from 'rxjs';
