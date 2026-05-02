import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, isValidRole } from '@libs/shared/auth';

/**
 * Role-based route guard
 * Ensures user is authenticated and has the required role to access a route
 * Route data should include 'roles' array: { roles: [1, 2] }
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as number[];
  if (!requiredRoles) {
    return true; // No role restriction for this route
  }

  // Get user's current role
  const userRole = authService.getCurrentRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user's role is in the required roles
  if (requiredRoles.includes(userRole)) {
    return true;
  }

  // User is authenticated but doesn't have the required role
  router.navigate(['/error/unauthorized']);
  return false;
};

// For backwards compatibility or alternative usage
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles = route.data['roles'] as number[];
    if (!requiredRoles) {
      return true;
    }

    const userRole = this.authService.getCurrentRole();
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/error/unauthorized']);
    return false;
  }
}
