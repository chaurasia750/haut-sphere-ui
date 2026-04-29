import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="width: 100%; height: 100%; background-color: white; padding: 20px; font-family: sans-serif;">
      <h1 style="font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 16px;">Shell Application</h1>
      <p style="color: #374151; margin-bottom: 16px;">This is the main shell app running on port 4100</p>
      <nav style="background-color: #e5e7eb; padding: 16px; border-radius: 4px;">
        <ul style="list-style: none; margin: 0; padding: 0;">
          <li><a href="/admin" style="color: #2563eb; text-decoration: none;">Admin Remote</a></li>
          <li><a href="/member" style="color: #2563eb; text-decoration: none;">Member Remote</a></li>
          <li><a href="/management" style="color: #2563eb; text-decoration: none;">Management Remote</a></li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {
  title = 'shell';
}
