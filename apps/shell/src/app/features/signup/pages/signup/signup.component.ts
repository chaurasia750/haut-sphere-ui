import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AadhaarInputDirective,
  NumberOnlyDirective,
  PanCardDirective,
  SharedAddressFormComponent,
} from '@shared/ui/src';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SharedAddressFormComponent,
    AadhaarInputDirective,
    PanCardDirective,
    NumberOnlyDirective,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  isSubmitting = false;
  positionOpen = false;
  readonly sponsorPrefix = 'ANON';

  selectPosition(value: string): void {
    this.signupForm.get('position')?.setValue(value);
    this.signupForm.get('position')?.markAsTouched();
    this.positionOpen = false;
  }

  closePositionDropdown(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (!related || !related.closest('#position-dropdown')) {
      this.positionOpen = false;
    }
  }

  readonly signupForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    // Aadhaar directive formats as "XXXX XXXX XXXX" — validator matches spaced format
    aadhaarNo: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4}$/)]],
    panCard: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    sponsorId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    position: ['', [Validators.required]],
    address: this.fb.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
    }),
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  get addressGroup() {
    return this.signupForm.controls.address;
  }

  isInvalid(controlName: string): boolean {
    const control: AbstractControl | null = this.signupForm.get(controlName);
    return !!(control?.touched && control?.invalid);
  }

  getError(controlName: string): string {
    const control: AbstractControl | null = this.signupForm.get(controlName);
    if (!control?.touched || !control?.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Enter a valid email address.';
    if (control.errors['pattern']) {
      if (controlName === 'phone') return 'Phone must be exactly 10 digits.';
      if (controlName === 'aadhaarNo') return 'Aadhaar must be 12 digits (XXXX XXXX XXXX).';
      if (controlName === 'panCard') return 'PAN format must be ABCDE1234F.';
    }
    if (control.errors['minlength'] || control.errors['maxlength'])
      return 'Sponsor ID must be exactly 6 characters.';
    if (controlName === 'position') return 'Please select a position.';
    return 'Invalid input.';
  }

  submit(): void {
    if (this.signupForm.invalid || this.isSubmitting) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.router.navigate(['/login']);
  }
}

