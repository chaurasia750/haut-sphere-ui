import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
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
export class AppComponent {}
