import { Component } from '@angular/core';
import { SponsorRegistrationComponent } from '@shared/members/src';

@Component({
  selector: 'app-admin-sponsor-new',
  standalone: true,
  imports: [SponsorRegistrationComponent],
  template: `
    <shared-sponsor-registration
      submitButtonText="Register New Member"
      submitLoadingText="Registering..."
    ></shared-sponsor-registration>
  `,
})
export class AdminSponsorNewComponent {}
