import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * UnauthorizedComponent - Displays when user lacks required role for a route
 */
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p class="text-gray-700 text-lg mb-8">
          You don't have permission to access this resource.
        </p>
        <a routerLink="/login" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Return to Login
        </a>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
