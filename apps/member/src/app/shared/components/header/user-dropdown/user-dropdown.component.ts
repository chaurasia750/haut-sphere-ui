import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '@libs/shared/auth';
import { MemberProfile, MemberProfileService } from '../../../services/member-profile.service';
import { take } from 'rxjs';

@Component({
  selector: 'member-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  profile: MemberProfile | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly memberProfileService: MemberProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  signOut(): void {
    this.closeDropdown();
    this.authService.logout().subscribe();
  }

  get displayName(): string {
    const parts = [this.profile?.title, this.profile?.firstName, this.profile?.lastName]
      .filter((value): value is string => Boolean(value?.trim()))
      .map((value) => value.trim());

    if (parts.length > 0) {
      return parts.join(' ');
    }

    return this.profile?.loginId?.trim() || 'Member';
  }

  get displayEmail(): string {
    return this.profile?.emailId?.trim() || 'No email';
  }

  get displayLoginId(): string {
    return this.profile?.loginId?.trim() || 'No login id';
  }

  get displayInitials(): string {
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

  private loadProfile(): void {
    this.memberProfileService
      .getProfile()
      .pipe(take(1))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.cdr.markForCheck();
        },
        error: () => {
          this.profile = null;
        },
      });
  }
}