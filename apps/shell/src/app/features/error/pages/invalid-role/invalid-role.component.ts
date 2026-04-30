import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * InvalidRoleComponent - Displays when user has an invalid or unsupported role
 */
@Component({
  selector: 'app-invalid-role',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <div class="mb-6">
          <svg class="mx-auto h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2m0 -4h4m-4 0H8"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Invalid Role</h1>
        <p class="text-gray-700 text-lg mb-8">
          Your account has an invalid or unsupported role. Please contact your administrator.
        </p>
        <button 
          (click)="logout()"
          class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Log Out
        </button>
      </div>
    </div>
  `
})
export class InvalidRoleComponent {
  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }
}
