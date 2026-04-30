import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="isLoginPage; else appLayout">
      <router-outlet></router-outlet>
    </ng-container>
    <ng-template #appLayout>
      <div style="width: 100%; height: 100%; background: white; padding: 20px; font-family: sans-serif;">
        <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">Shell Application</h1>
        <nav style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
          <a href="/admin" style="color: #2563eb; text-decoration: none; margin-right: 16px;">Admin</a>
          <a href="/member" style="color: #2563eb; text-decoration: none; margin-right: 16px;">Member</a>
          <a href="/management" style="color: #2563eb; text-decoration: none;">Management</a>
        </nav>
        <div style="border: 1px solid #e5e7eb; padding: 16px; border-radius: 4px;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoginPage = false;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkRoute();
      });
  }

  private checkRoute() {
    this.isLoginPage = this.router.url === '/login';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
