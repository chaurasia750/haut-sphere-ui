import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { apiConfig } from '@shared/environments/api.dev';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store token on successful login', (done) => {
      const credentials = { username: 'test', password: 'password' };
      const response = { accessToken: 'test-token', expiresAt: Date.now() + 3600000 };

      service.login(credentials).subscribe((user) => {
        expect(localStorage.getItem('auth_token')).toBe('test-token');
        done();
      });

      const req = httpMock.expectOne(`${apiConfig.baseUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(response);

      // Also expect user fetch
      const userReq = httpMock.expectOne(`${apiConfig.baseUrl}/api/shell/user`);
      userReq.flush({ id: '1', username: 'test', email: 'test@example.com', roles: ['user'] });
    });

    it('should set isAuthenticated to true on login', (done) => {
      service.login({ username: 'test', password: 'password' }).subscribe(() => {
        service.isAuthenticated().subscribe((isAuth) => {
          expect(isAuth).toBe(true);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiConfig.baseUrl}/api/auth/login`);
      req.flush({ accessToken: 'test-token' });

      const userReq = httpMock.expectOne(`${apiConfig.baseUrl}/api/shell/user`);
      userReq.flush({ id: '1', username: 'test', email: 'test@example.com', roles: [] });
    });
  });

  describe('logout', () => {
    it('should clear token on logout', (done) => {
      localStorage.setItem('auth_token', 'test-token');

      service.logout().subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${apiConfig.baseUrl}/api/auth/logout`);
      req.flush({});
    });

    it('should set isAuthenticated to false on logout', (done) => {
      localStorage.setItem('auth_token', 'test-token');

      service.logout().subscribe(() => {
        service.isAuthenticated().subscribe((isAuth) => {
          expect(isAuth).toBe(false);
          done();
        });
      });

      const req = httpMock.expectOne(`${apiConfig.baseUrl}/api/auth/logout`);
      req.flush({});
    });
  });

  describe('hasRole', () => {
    it('should return true if user has role', (done) => {
      const user = { id: '1', username: 'test', email: 'test@example.com', roles: ['admin'] };
      (service as any).currentUser$.next(user);

      service.hasRole('admin').subscribe((hasRole) => {
        expect(hasRole).toBe(true);
        done();
      });
    });

    it('should return false if user does not have role', (done) => {
      const user = { id: '1', username: 'test', email: 'test@example.com', roles: ['user'] };
      (service as any).currentUser$.next(user);

      service.hasRole('admin').subscribe((hasRole) => {
        expect(hasRole).toBe(false);
        done();
      });
    });

    it('should return false if user is not logged in', (done) => {
      service.hasRole('admin').subscribe((hasRole) => {
        expect(hasRole).toBe(false);
        done();
      });
    });
  });
});
