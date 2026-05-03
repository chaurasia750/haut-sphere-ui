import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { MemberProfileService } from '../../../services/member-profile.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-info-card',
  imports: [
    CommonModule,
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
  ],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent implements OnInit {

  constructor(
    public modal: ModalService,
    private readonly memberProfileService: MemberProfileService
  ) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  user = {
    firstName: 'Petey',
    lastName: 'Cruiser',
    email: 'peteycruiser@yopmail.com',
    phone: '+91-9876543210',
    bio: 'Team Member',
    social: {
      facebook: 'https://www.facebook.com/',
      x: 'https://x.com/',
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://instagram.com/',
    },
  };

  ngOnInit(): void {
    this.memberProfileService
      .getProfile()
      .pipe(take(1))
      .subscribe({
        next: (profile) => {
          this.user = {
            ...this.user,
            firstName: `${profile.title?.trim() ?? ''} ${profile.firstName?.trim() ?? ''}`.trim() || 'Member',
            lastName: profile.lastName?.trim() || '-',
            email: profile.emailId?.trim() || '-',
            phone: profile.primaryContactNumber?.trim() || '-',
            bio: profile.registrationNumber?.trim() || profile.loginId?.trim() || 'Member',
          };
        },
        error: () => {
          // Keep fallback static values if API fails.
        },
      });
  }

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }
}
