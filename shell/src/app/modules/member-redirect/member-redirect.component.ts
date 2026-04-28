import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-redirect',
  standalone: false,
  template: `
    <div style="padding: 20px; text-align: center;">
      <h2>Member Application</h2>
      <p>Redirecting to member application...</p>
    </div>
  `,
})
export class MemberRedirectComponent implements OnInit {
  ngOnInit(): void {
    // Redirect to the member remote app running on port 4202
    window.location.href = 'http://localhost:4202';
  }
}
