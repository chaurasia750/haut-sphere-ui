import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SharedTranslationService } from '@shared/i18n';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (isLoginPage) {
      <router-outlet></router-outlet>
    } @else {
      <div style="width: 100%; height: 100%;">
        <router-outlet></router-outlet>
      </div>
    }
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

  constructor(
    private router: Router,
    private title: Title,
    private i18n: SharedTranslationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.i18n.setDocumentTitle(this.title);

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
    this.isLoginPage = this.router.url.startsWith('/login') || this.router.url.startsWith('/signup');
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
