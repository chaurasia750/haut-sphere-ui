import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, RoleId, ValidRoleId } from '@libs/shared/auth';

function resolveRequiredRoles(url: string, routeRoles?: ValidRoleId[]): ValidRoleId[] | undefined {
  if (routeRoles && routeRoles.length > 0) {
    return routeRoles;
  }

  if (url.startsWith('/admin')) {
    return [RoleId.SYSTEM_ADMIN, RoleId.ADMIN];
  }

  if (url.startsWith('/member')) {
    return [RoleId.MEMBER];
  }

  if (url.startsWith('/management')) {
    return [RoleId.MANAGER];
  }

  return undefined;
}

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const routeRoles = route.data['roles'] as ValidRoleId[] | undefined;
  const requiredRoles = resolveRequiredRoles(state.url, routeRoles);
  if (!requiredRoles) {
    return true;
  }

  const userRole = authStore.roleId();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/error/unauthorized']);
  return false;
};
