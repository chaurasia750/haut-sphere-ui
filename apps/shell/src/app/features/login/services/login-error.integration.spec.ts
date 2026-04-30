import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LoginComponent } from '../pages/login/login.component';
import { AuthService, RoleId } from '@libs/shared/auth';
import { LoginErrorService } from './login-error.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('Login Error Handling Integration Tests', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let errorService: LoginErrorService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        LoginErrorService
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    errorService = TestBed.inject(LoginErrorService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('401 Unauthorized Error', () => {
    it('should display correct error message for invalid credentials', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 401 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'wrong@example.com',
        password: 'wrong'
      });

      component.onSubmit();
      expect(component.errorMessage).toBe('Invalid email or password');
    });

    it('should allow retry after 401 error', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 401 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'password'
      });

      component.onSubmit();
      expect(component.errorMessage).toContain('Invalid');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('400 Bad Request Error', () => {
    it('should display generic error message for 400', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 400 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'password'
      });

      component.onSubmit();
      expect(component.errorMessage).toBe('Please check your email and password');
    });
  });

  describe('500+ Server Errors', () => {
    it('should display system unavailable for 500 error', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 500 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'password'
      });

      component.onSubmit();
      expect(component.errorMessage).toBe('System unavailable. Please try again later');
    });

    it('should display system unavailable for 502 error', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 502 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'password'
      });

      component.onSubmit();
      expect(component.errorMessage).toContain('System unavailable');
    });

    it('should display system unavailable for 503 error', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 503 }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'password'
      });

      component.onSubmit();
      expect(component.errorMessage).toContain('System unavailable');
    });
  });

  describe('Invalid Role Handling', () => {
    it('should handle invalid role with generic error message', () => {
      // AuthService login should validate role and throw error
      authService.login.and.returnValue(
        throwError(() => ({
          status: 200,
          error: { code: 'INVALID_ROLE' }
        }))
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'invalid-role@example.com',
        password: 'password'
      });

      component.onSubmit();
      // Error message should be generic and not reveal role issue
      expect(component.errorMessage).toBeTruthy();
    });
  });

  describe('Error Clearing', () => {
    it('should clear error message when user modifies form', (done) => {
      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.errorMessage = 'Test error';

      component.loginForm.patchValue({
        email: 'new@example.com'
      });

      component.loginForm.valueChanges.subscribe(() => {
        expect(component.errorMessage).toBe('');
        done();
      });
    });

    it('should clear error message when user changes password', (done) => {
      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.errorMessage = 'Test error';

      component.loginForm.patchValue({
        password: 'newpassword'
      });

      component.loginForm.valueChanges.subscribe(() => {
        expect(component.errorMessage).toBe('');
        done();
      });
    });
  });

  describe('Error Service', () => {
    it('should correctly identify retryable errors', () => {
      expect(errorService.isRetryable({ status: 500 })).toBe(true);
      expect(errorService.isRetryable({ status: 401 })).toBe(false);
      expect(errorService.isRetryable({ status: 0 })).toBe(true);
    });

    it('should map all error codes', () => {
      const codes = [401, 400, 500, 502, 503, 504];
      codes.forEach(code => {
        const message = errorService.mapErrorToUserMessage({ status: code });
        expect(message).toBeTruthy();
        expect(message.length > 0).toBe(true);
      });
    });
  });
});
