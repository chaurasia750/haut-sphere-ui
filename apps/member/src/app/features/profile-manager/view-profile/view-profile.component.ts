import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { MemberProfile, MemberProfileService } from '../../../shared/services/member-profile.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    PageBreadcrumbComponent,
    RouterModule,
  ],
  templateUrl: './view-profile.component.html',
})
export class ViewProfileComponent implements OnInit {
  profile: MemberProfile | null = null;
  isLoading = true;

  constructor(
    private readonly memberProfileService: MemberProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.memberProfileService.getProfile().pipe(take(1)).subscribe({
      next: (p) => { this.profile = p; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  get fullName(): string {
    return [this.profile?.title, this.profile?.firstName, this.profile?.lastName]
      .filter(v => !!v?.trim()).join(' ') || '—';
  }

  get initials(): string {
    const first = this.profile?.firstName?.trim();
    const last = this.profile?.lastName?.trim();
    if (first && last) {
      return (first.charAt(0) + last.charAt(0)).toUpperCase();
    }
    if (first) {
      return first.charAt(0).toUpperCase();
    }
    return this.profile?.loginId?.charAt(0)?.toUpperCase() || 'M';
  }

  get addressLine(): string {
    const a = this.profile?.address;
    if (!a) return '—';
    return [a.houseNo, a.street, a.city, a.state, a.zipCode].filter(v => !!v?.trim()).join(', ') || '—';
  }

  get locationLine(): string {
    const a = this.profile?.address;
    if (!a) {
      return '—';
    }
    return [a.city, a.state].filter((v) => !!v?.trim()).join(', ') || '—';
  }

  val(v: string | null | undefined): string {
    return v?.trim() || '—';
  }

  get displayGender(): string {
    const value = this.profile?.gender?.trim();
    if (!value) {
      return '—';
    }

    if (value === '1') {
      return 'Male';
    }

    if (value === '2') {
      return 'Female';
    }

    return value;
  }
}
