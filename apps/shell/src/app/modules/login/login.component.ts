import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div style="padding: 40px; max-width: 400px; margin: 100px auto; text-align: center;">
      <h2>Login</h2>
      <p>Demo: Click below to proceed without authentication</p>
      <button (click)="demoLogin()" style="padding: 10px 20px; font-size: 16px;">
        Continue as Demo User
      </button>
    </div>
  `,
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  demoLogin(): void {
    // Store a demo token
    localStorage.setItem('auth_token', 'demo-token-12345');
    this.router.navigate(['/member']);
  }
}
