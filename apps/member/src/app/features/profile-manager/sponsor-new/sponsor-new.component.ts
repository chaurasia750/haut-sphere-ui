import { Component, inject, OnInit } from '@angular/core';
import { SponsorRegistrationComponent } from '@shared/members/src';
import { MemberProfileService } from '../../../shared/services/member-profile.service';

@Component({
  selector: 'app-sponsor-new',
  standalone: true,
  imports: [SponsorRegistrationComponent],
  template: `
    @if (sponsorRegNo) {
      <shared-sponsor-registration
        [hideSponsorId]="true"
        [presetSponsorId]="sponsorRegNo"
        submitButtonText="Register Sponsor"
        submitLoadingText="Registering..."
      ></shared-sponsor-registration>
    } @else {
      <div class="flex items-center justify-center py-20">
        <svg class="h-8 w-8 animate-spin text-[#FFD000]" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    }
  `,
})
export class SponsorNewComponent implements OnInit {
  private readonly profileService = inject(MemberProfileService);

  sponsorRegNo = '';

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        const regNo = profile.registrationNumber;
        this.sponsorRegNo = regNo ? String(regNo).trim() : '';
      },
    });
  }
}
