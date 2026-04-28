import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkRole(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkRole(route);
  }

  private checkRole(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'];

    if (!requiredRole) {
      return new Observable((observer) => {
        observer.next(true);
        observer.complete();
      });
    }

    return this.authService.hasRole(requiredRole).pipe(
      map((hasRole) => {
        if (!hasRole) {
          this.router.navigate(['/access-denied']);
          return false;
        }
        return true;
      })
    );
  }
}
