import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '@libs/shared/auth';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form validation', () => {
    it('should create login form with email and password controls', () => {
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
    });

    it('should mark email field as required', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should mark password field as required', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should disable submit button when form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.setValue({
        email: 'valid@example.com',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('form submission', () => {
    it('should prevent submission when form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call AuthService.login with credentials', () => {
      authService.login.and.returnValue(of({ roleId: 1, userId: 'user-1', expiresIn: 1800 }));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123'
      });
      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should navigate based on user role after successful login', () => {
      authService.login.and.returnValue(of({ roleId: 1, userId: 'user-1', expiresIn: 1800 }));

      component.loginForm.setValue({
        email: 'admin@example.com',
        password: 'password'
      });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should prevent double submission', () => {
      authService.login.and.returnValue(of({ roleId: 2, userId: 'user-2', expiresIn: 1800 }));

      component.isLoading = true;
      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should display 401 error message for invalid credentials', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 401 }))
      );

      component.loginForm.setValue({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
      component.onSubmit();

      fixture.detectChanges();
      expect(component.errorMessage).toBe('Invalid email or password');
    });

    it('should display 500 error message for server errors', () => {
      authService.login.and.returnValue(
        throwError(() => ({ status: 500 }))
      );

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password'
      });
      component.onSubmit();

      fixture.detectChanges();
      expect(component.errorMessage).toBe('System unavailable. Please try again later');
    });

    it('should clear error message when user changes form input', () => {
      component.errorMessage = 'Test error';
      component.loginForm.patchValue({ email: 'new@example.com' });

      expect(component.errorMessage).toBe('');
    });
  });

  describe('field helpers', () => {
    it('should return error message for invalid email field', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      const error = component.getFieldError('email');
      expect(error).toContain('Email');
      expect(error).toContain('required');
    });

    it('should check if field is invalid and touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid');
      emailControl?.markAsTouched();

      expect(component.isFieldInvalid('email')).toBe(true);
    });
  });
});
