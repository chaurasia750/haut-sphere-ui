import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remote-unavailable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 24px; max-width: 860px; margin: 0 auto;">
      <h2 style="margin: 0 0 12px; font-size: 24px; line-height: 32px; color: #111827;">
        {{ title || 'Remote App Unavailable' }}
      </h2>
      <p style="margin: 0 0 8px; color: #374151;">
        {{ message || 'The requested microfrontend is currently unavailable. Please ensure the remote server is running.' }}
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        If the issue persists, restart the remote app and refresh this page.
      </p>
    </section>
  `,
})
export class RemoteUnavailableComponent {
  @Input() title = '';
  @Input() message = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data || {};
    if (!this.title && data['title']) {
      this.title = data['title'];
    }
    if (!this.message && data['message']) {
      this.message = data['message'];
    }
  }
}
