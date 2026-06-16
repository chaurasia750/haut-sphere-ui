import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberProfileService, MemberProfile } from "../../services/member-profile.service";

@Component({
  selector: "app-distributor-details",
  imports: [CommonModule],
  templateUrl: "./distributor-details.component.html",
})
export class DistributorDetailsComponent implements OnInit {
  profile: MemberProfile | null = null;

  constructor(private readonly profileService: MemberProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (p) => this.profile = p,
    });
  }

  get fullName(): string {
    if (!this.profile) return '—';
    const parts = [this.profile.title, this.profile.firstName, this.profile.lastName].filter(Boolean);
    return parts.join(' ') || '—';
  }

  val(v: string | null | undefined): string {
    return v ?? '—';
  }
}
