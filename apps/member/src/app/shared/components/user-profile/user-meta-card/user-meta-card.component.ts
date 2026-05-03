import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberProfile, MemberProfileService } from '../../../services/member-profile.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-meta-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-meta-card.component.html',
})
export class UserMetaCardComponent implements OnInit {
  profile: MemberProfile | null = null;

  constructor(
    private readonly memberProfileService: MemberProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.memberProfileService.getProfile().pipe(take(1)).subscribe({
      next: (p) => { this.profile = p; this.cdr.markForCheck(); },
      error: () => {},
    });
  }

  get fullName(): string {
    return [this.profile?.title, this.profile?.firstName, this.profile?.lastName]
      .filter(v => !!v?.trim()).join(' ') || 'Member';
  }

  get locationLine(): string {
    const a = this.profile?.address;
    if (!a) return '—';
    return [a.city, a.state].filter(v => !!v?.trim()).join(', ') || '—';
  }

  val(v: string | null | undefined): string {
    return v?.trim() || '—';
  }
}
