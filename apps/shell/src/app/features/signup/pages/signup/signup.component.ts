import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';
import { SharedTranslationService } from '@shared/i18n';
import {
  AadhaarInputDirective,
  PanCardDirective,
  PhoneFormatDirective,
  SharedAddressFormComponent,
} from '@shared/ui/src';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    SharedAddressFormComponent,
    AadhaarInputDirective,
    PanCardDirective,
    PhoneFormatDirective,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private readonly i18n = inject(SharedTranslationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly signupService = inject(SignupService);

  isSubmitting = false;
  positionOpen = false;
  readonly sponsorPrefix = this.i18n.instant('app.sponsorPrefix', 'ANON');
  sponsorLookupName = '';
  isSponsorLookupPending = false;

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
    firstName: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{2}$/)]],
    businessCategory: ['', [Validators.required]],
    // Aadhaar directive formats as "XXXX XXXX XXXX" — validator matches spaced format
    aadhaarNo: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4}$/)]],
    panCard: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    sponsorId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    position: ['', [Validators.required]],
    address: this.fb.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      country: [{ value: 'India', disabled: true }, [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    }),
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.setupSponsorValidation();
  }

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
    if (control.errors['required']) return this.i18n.instant('signup.validation.required', 'This field is required.');
    if (control.errors['email']) return this.i18n.instant('signup.validation.email', 'Enter a valid email address.');
    if (control.errors['pattern']) {
      if (controlName === 'firstName' || controlName === 'lastName') return this.i18n.instant('signup.validation.noSpaces', 'Name cannot contain spaces.');
      if (controlName === 'phone') return this.i18n.instant('signup.validation.phone', 'Enter a valid 10-digit mobile number.');
      if (controlName === 'aadhaarNo') return this.i18n.instant('signup.validation.aadhaar', 'Aadhaar must be 12 digits (XXXX XXXX XXXX).');
      if (controlName === 'panCard') return this.i18n.instant('signup.validation.pan', 'PAN format must be ABCDE1234F.');
    }
    if (controlName === 'businessCategory') return this.i18n.instant('signup.validation.businessCategory', 'Please select a business category.');
    if (control.errors['invalidSponsor']) return this.i18n.instant('signup.sponsor.notFound', 'Sponsor ID was not found.');
    if (control.errors['minlength'] || control.errors['maxlength'])
      return this.i18n.instant('signup.validation.sponsorIdLength', 'Sponsor ID must be exactly 6 characters.');
    if (controlName === 'position') return this.i18n.instant('signup.validation.position', 'Please select a position.');
    return this.i18n.instant('signup.validation.invalid', 'Invalid input.');
  }

  getPositionLabel(value: string | null | undefined): string {
    if (value === 'left') {
      return this.i18n.instant('signup.position.left', 'Left');
    }

    if (value === 'right') {
      return this.i18n.instant('signup.position.right', 'Right');
    }

    return this.i18n.instant('signup.position.placeholder', 'Select...');
  }

  private setupSponsorValidation(): void {
    const sponsorIdControl = this.signupForm.get('sponsorId');
    if (!sponsorIdControl) {
      return;
    }

    sponsorIdControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((rawValue) => {
          const value = (rawValue ?? '').toString().trim().toUpperCase();
          if (value !== rawValue) {
            sponsorIdControl.setValue(value, { emitEvent: false });
          }

          this.sponsorLookupName = '';
          this.isSponsorLookupPending = false;
          this.clearSponsorLookupError();
        }),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(() => {
          // Always switch on each change so in-flight lookup is cancelled.
          // This prevents stale responses from restoring old sponsor names.
          if (!sponsorIdControl.valid) {
            return of(null);
          }

          this.isSponsorLookupPending = true;
          const fullSponsorId = this.getFullSponsorId();
          return this.signupService
            .validateSponsor(fullSponsorId)
            .pipe(
              tap((sponsorName) => {
                this.sponsorLookupName = sponsorName;
                if (!sponsorName) {
                  this.setSponsorLookupError();
                }
              }),
              catchError(() => {
                this.setSponsorLookupError();
                return of(null);
              }),
              finalize(() => {
                this.isSponsorLookupPending = false;
              })
            );
        })
      )
      .subscribe();
  }

  private getFullSponsorId(): string {
    const suffix = (this.signupForm.get('sponsorId')?.value ?? '').toString().trim().toUpperCase();
    return `${this.sponsorPrefix}${suffix}`;
  }

  private setSponsorLookupError(): void {
    const sponsorIdControl = this.signupForm.get('sponsorId');
    if (!sponsorIdControl) {
      return;
    }

    sponsorIdControl.setErrors({
      ...(sponsorIdControl.errors ?? {}),
      invalidSponsor: true,
    });
  }

  private clearSponsorLookupError(): void {
    const sponsorIdControl = this.signupForm.get('sponsorId');
    if (!sponsorIdControl?.errors?.['invalidSponsor']) {
      return;
    }

    const { invalidSponsor, ...remainingErrors } = sponsorIdControl.errors;
    sponsorIdControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
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

