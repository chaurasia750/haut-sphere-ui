import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService, RoleId } from '@libs/shared/auth';
import { of } from 'rxjs';

describe('Role-Based Routing Integration Tests', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Role 1 (System Admin) Routing', () => {
    it('should navigate to /admin for role 1 user', (done) => {
      authService.login.and.returnValue(
        of({ roleId: RoleId.SYSTEM_ADMIN, userId: 'admin-1', expiresIn: 1800 })
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'admin@example.com',
        password: 'password'
      });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
      done();
    });
  });

  describe('Role 2 (Admin) Routing', () => {
    it('should navigate to /admin for role 2 user', (done) => {
      authService.login.and.returnValue(
        of({ roleId: RoleId.ADMIN, userId: 'admin-2', expiresIn: 1800 })
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'mgr@example.com',
        password: 'password'
      });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
      done();
    });
  });

  describe('Role 3 (Member) Routing', () => {
    it('should navigate to /member for role 3 user', (done) => {
      authService.login.and.returnValue(
        of({ roleId: RoleId.MEMBER, userId: 'member-1', expiresIn: 1800 })
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'member@example.com',
        password: 'password'
      });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/member']);
      done();
    });
  });

  describe('Role 4 (Manager) Routing', () => {
    it('should navigate to /management for role 4 user', (done) => {
      authService.login.and.returnValue(
        of({ roleId: RoleId.MANAGER, userId: 'mgr-1', expiresIn: 1800 })
      );

      const component = TestBed.createComponent(LoginComponent).componentInstance;
      component.loginForm.patchValue({
        email: 'manager@example.com',
        password: 'password'
      });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/management']);
      done();
    });
  });
});
