import { Component, inject, OnDestroy } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthService, AuthStore } from '@libs/shared/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnDestroy {
  title = 'Shell Dashboard';
  message = 'Session-aware workspace for authenticated users.';
  remainingSeconds = 0;
  private destroy$ = new Subject<void>();
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authStore.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.remainingSeconds = Math.max(0, state.expiresIn);
      });

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds -= 1;
        }
      });
  }

  get userId(): string {
    return this.authStore.userId() ?? '-';
  }

  get roleName(): string {
    return this.authStore.roleName() ?? '-';
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
