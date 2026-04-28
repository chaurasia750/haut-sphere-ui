import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * 
 * Usage in routing:
 * {
 *   path: 'admin',
 *   canActivate: [AuthGuard],
 *   component: AdminComponent
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const auth = this.authService.getCurrentAuthState();

    if (auth.isAuthenticated && this.authService.isTokenValid(auth.tokenExpiresAt)) {
      return true;
    }

    // Redirect to login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

/**
 * Role Guard - Protects routes that require a specific role
 * 
 * Usage in routing:
 * {
 *   path: 'admin',
 *   canActivate: [RoleGuard],
 *   data: { roles: ['admin', 'superuser'] },
 *   component: AdminComponent
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const auth = this.authService.getCurrentAuthState();
    const requiredRoles: string[] = route.data['roles'] || [];

    // First check if authenticated
    if (!auth.isAuthenticated || !this.authService.isTokenValid(auth.tokenExpiresAt)) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if user has required role
    if (requiredRoles.length === 0) {
      return true; // No specific role required
    }

    const hasRole = requiredRoles.some(role => this.authService.hasRole(role));

    if (!hasRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

/**
 * Permission Guard - Protects routes that require specific permissions
 * 
 * Usage in routing:
 * {
 *   path: 'settings',
 *   canActivate: [PermissionGuard],
 *   data: { permissions: ['read:settings', 'write:settings'] },
 *   component: SettingsComponent
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const auth = this.authService.getCurrentAuthState();
    const requiredPermissions: string[] = route.data['permissions'] || [];

    // First check if authenticated
    if (!auth.isAuthenticated || !this.authService.isTokenValid(auth.tokenExpiresAt)) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if user has required permissions
    if (requiredPermissions.length === 0) {
      return true; // No specific permission required
    }

    const hasPermission = requiredPermissions.some(perm => 
      this.authService.hasPermission(perm)
    );

    if (!hasPermission) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

/**
 * Functional API for guards (Angular 15+)
 * More tree-shakeable alternative
 */

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = authService.getCurrentAuthState();

  if (auth.isAuthenticated && authService.isTokenValid(auth.tokenExpiresAt)) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = authService.getCurrentAuthState();
  const requiredRoles: string[] = route.data['roles'] || [];

  if (!auth.isAuthenticated || !authService.isTokenValid(auth.tokenExpiresAt)) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.some(role => authService.hasRole(role));

  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = authService.getCurrentAuthState();
  const requiredPermissions: string[] = route.data['permissions'] || [];

  if (!auth.isAuthenticated || !authService.isTokenValid(auth.tokenExpiresAt)) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (requiredPermissions.length === 0) {
    return true;
  }

  const hasPermission = requiredPermissions.some(perm =>
    authService.hasPermission(perm)
  );

  if (!hasPermission) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

// Import inject for functional API
import { inject } from '@angular/core';
