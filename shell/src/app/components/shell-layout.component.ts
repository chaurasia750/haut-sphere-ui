import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';
import { RemoteLoaderService } from '../services/remote-loader.service';

/**
 * Shell Layout Component
 * Main application layout with header, navigation, and content area
 */
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shell-layout">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="app-title">HAUT Spare</h1>
            <p class="app-subtitle">Module Federation Demo</p>
          </div>
          <div class="nav-spacer"></div>
        </div>
      </header>

      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="nav-content">
          <a routerLink="/home" routerLinkActive="active" 
             [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
            Home
          </a>
          <a routerLink="/admin" routerLinkActive="active" class="nav-link">
            Admin
          </a>
          <a routerLink="/member" routerLinkActive="active" class="nav-link">
            Member
          </a>
          <a routerLink="/management" routerLinkActive="active" class="nav-link">
            Management
          </a>

          <!-- Loading indicator -->
          <div class="nav-right">
            <div *ngIf="isLoading$ | async" class="loading-indicator">
              <span class="spinner-small"></span>
              <span>Loading...</span>
            </div>

            <!-- Current remote badge -->
            <div *ngIf="currentRemote$ | async as remote" class="remote-badge">
              {{ remote }}
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-left">
            <p>HAUT Spare © 2026 | Module Federation Architecture</p>
          </div>
          <div class="footer-right">
            <span class="footer-stat" *ngIf="remoteCount$ | async as count">
              Loaded Remotes: {{ count }}
            </span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .shell-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f5f5;
    }

    /* Header Styles */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .logo-section {
      flex: 1;
    }

    .app-title {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .app-subtitle {
      margin: 0.25rem 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .nav-spacer {
      flex: 1;
    }

    /* Navigation Bar */
    .navbar {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      display: flex;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 60px;
      gap: 2rem;
    }

    .nav-link {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: #f0f0f0;
      color: #667eea;
    }

    .nav-link.active {
      color: #667eea;
      background: #f5f7ff;
      font-weight: 600;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid #e0e0e0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .remote-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Footer */
    .footer {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 2rem 0;
      margin-top: auto;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-left {
      flex: 1;
    }

    .footer-left p {
      margin: 0;
      font-size: 0.9rem;
    }

    .footer-right {
      text-align: right;
    }

    .footer-stat {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-content {
        padding: 0 1rem;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .nav-link {
        padding: 0.4rem 0.8rem;
        font-size: 0.95rem;
      }

      .main-content {
        padding: 1rem;
      }

      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .footer-right {
        text-align: center;
      }
    }
  `]
})
export class ShellLayoutComponent implements OnInit {
  isLoading$: Observable<boolean>;
  currentRemote$: Observable<string | null>;
  remoteCount$: Observable<number>;

  constructor(
    private remoteLoader: RemoteLoaderService,
    private router: Router
  ) {
    this.isLoading$ = this.remoteLoader.getIsLoading$();
    this.currentRemote$ = this.remoteLoader.getCurrentRemote$();
    this.remoteCount$ = this.remoteLoader.getMetadata$().pipe(
      map(metadata => {
        return Object.values(metadata).filter(m => m.state === 'loaded').length;
      }),
      startWith(0)
    );
  }

  ngOnInit(): void {
    // Track navigation for loading indicator
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationStart || e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Could update loading state based on navigation
      });
  }
}
