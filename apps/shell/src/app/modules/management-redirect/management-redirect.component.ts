import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management-redirect',
  standalone: false,
  template: `
    <div style="padding: 20px; text-align: center;">
      <h2>Management Application</h2>
      <p>Redirecting to management application...</p>
    </div>
  `,
})
export class ManagementRedirectComponent implements OnInit {
  ngOnInit(): void {
    // Redirect to the management remote app running on port 4203
    window.location.href = 'http://localhost:4203';
  }
}
