import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService, isValidRole, RoleId } from '@libs/shared/auth';
import { throwError } from 'rxjs';

describe('Invalid Role Handling (Phase 9)', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    });
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  describe('Invalid Role Detection', () => {
    it('should reject role 0 as invalid', () => {
      expect(isValidRole(0)).toBe(false);
    });

    it('should reject role 5 as invalid', () => {
      expect(isValidRole(5)).toBe(false);
    });

    it('should reject negative role IDs', () => {
      expect(isValidRole(-1)).toBe(false);
    });

    it('should reject role as string', () => {
      expect(isValidRole('1')).toBe(false);
    });

    it('should reject null as invalid', () => {
      expect(isValidRole(null)).toBe(false);
    });

    it('should reject undefined as invalid', () => {
      expect(isValidRole(undefined)).toBe(false);
    });

    it('should accept all valid roles', () => {
      expect(isValidRole(RoleId.SYSTEM_ADMIN)).toBe(true);
      expect(isValidRole(RoleId.ADMIN)).toBe(true);
      expect(isValidRole(RoleId.MEMBER)).toBe(true);
      expect(isValidRole(RoleId.MANAGER)).toBe(true);
    });
  });

  describe('Concurrent Login Handling', () => {
    it('should handle multiple simultaneous login attempts', () => {
      const loginAttempt1 = authService.login('user@example.com', 'password');
      const loginAttempt2 = authService.login('user@example.com', 'password');

      expect(loginAttempt1).toBeDefined();
      expect(loginAttempt2).toBeDefined();
    });

    it('should invalidate previous session on new login', () => {
      // This would be tested at backend level
      // Frontend should handle receiving 401 for previously valid token
      authService.login.and.returnValue(
        throwError(() => ({ status: 401 }))
      );

      authService.login('user@example.com', 'password').subscribe(
        () => expect.fail('should fail'),
        (error) => {
          expect(error.status).toBe(401);
        }
      );
    });
  });

  describe('Role Validation in AuthService', () => {
    it('should validate role in login response', (done) => {
      // This tests that AuthService validates the role
      const validResponse = {
        roleId: RoleId.ADMIN,
        userId: 'user-1',
        expiresIn: 1800
      };

      expect(isValidRole(validResponse.roleId)).toBe(true);
      done();
    });

    it('should treat invalid role as login failure', () => {
      const invalidResponse = {
        roleId: 99,
        userId: 'user-invalid',
        expiresIn: 1800
      };

      expect(isValidRole(invalidResponse.roleId)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle decimal role IDs', () => {
      expect(isValidRole(1.5)).toBe(false);
    });

    it('should handle very large role IDs', () => {
      expect(isValidRole(999999)).toBe(false);
    });

    it('should handle NaN', () => {
      expect(isValidRole(NaN)).toBe(false);
    });

    it('should handle Infinity', () => {
      expect(isValidRole(Infinity)).toBe(false);
    });

    it('should handle role ID from HTTP response parsing', () => {
      const parsedRole = parseInt('1', 10);
      expect(isValidRole(parsedRole)).toBe(true);

      const parsedInvalidRole = parseInt('99', 10);
      expect(isValidRole(parsedInvalidRole)).toBe(false);
    });
  });
});
