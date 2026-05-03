import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, ValidRoleId } from '@libs/shared/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data['roles'] as ValidRoleId[] | undefined;
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
