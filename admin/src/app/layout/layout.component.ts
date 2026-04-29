import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div style="padding: 16px; background: #f5f5f5; border-radius: 4px;">
      <h2 style="margin: 0; color: #333;">📊 Admin Portal</h2>
      <p style="color: #666; margin: 8px 0;">Welcome to the Admin Portal - Loaded from Remote Module Federation</p>
      <div style="margin-top: 12px; padding: 8px; background: white; border-radius: 2px;">
        <small style="color: #999;">Remote: admin | Port: 4101</small>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LayoutComponent {}
