import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-redirect',
  standalone: false,
  template: `
    <div style="padding: 20px; text-align: center;">
      <h2>Admin Application</h2>
      <p>Redirecting to admin application...</p>
    </div>
  `,
})
export class AdminRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect to the admin remote app running on port 4201
    window.location.href = 'http://localhost:4201';
  }
}
