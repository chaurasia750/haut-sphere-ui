import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';
import { SharedTranslationService } from '@shared/i18n';
import {
  AadhaarInputDirective,
  PanCardDirective,
  PhoneFormatDirective,
  SharedAddressFormComponent,
  SharedTitleSelectComponent,
} from '@shared/ui/src';
import { SignupService, RegisterMemberPayload } from '../../services/signup.service';

import { apiConfig } from '../../../../../environments/api.dev.config';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    SharedAddressFormComponent,
    SharedTitleSelectComponent,
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

  positionOpen = false;
  readonly apiBaseUrl = apiConfig.baseUrl;
  readonly sponsorPrefix = this.i18n.instant('app.sponsorPrefix', 'ANON');
  sponsorLookupName = '';
  isSponsorLookupPending = false;
  isLoading = false;
  sponsorRegNo: number | null = null;

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
    title: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    gender: ['', [Validators.required]],
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
    if (control.errors['required']) {
      const fieldNames: Record<string, string> = {
        'title': 'Title',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'gender': 'Gender',
        'email': 'Email',
        'phone': 'Phone',
        'aadhaarNo': 'Aadhaar Number',
        'panCard': 'PAN Card',
        'businessCategory': 'Business Category',
        'sponsorId': 'Sponsor ID',
        'position': 'Position',
      };
      const fieldName = fieldNames[controlName] || controlName;
      return `${fieldName} is required.`;
    }
    if (controlName === 'title') return 'Please select a title.';
    if (controlName === 'gender') return 'Please select gender.';
    if (control.errors['email']) return 'Enter a valid email address.';
    if (control.errors['pattern']) {
      if (controlName === 'firstName' || controlName === 'lastName') return 'Name cannot contain spaces.';
      if (controlName === 'phone') return 'Enter a valid 10-digit mobile number.';
      if (controlName === 'aadhaarNo') return 'Aadhaar must be 12 digits (XXXX XXXX XXXX).';
      if (controlName === 'panCard') return 'PAN format must be ABCDE1234F.';
    }
    if (controlName === 'businessCategory') return 'Please select a business category.';
    if (control.errors['invalidSponsor']) return 'Sponsor ID was not found.';
    if (control.errors['minlength'] || control.errors['maxlength'])
      return 'Sponsor ID must be exactly 6 characters.';
    if (controlName === 'position') return 'Please select a position.';
    return 'Invalid input.';
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

  onFirstNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    if (upper !== input.value) {
      const control = this.signupForm.get('firstName');
      control?.setValue(upper, { emitEvent: false });
    }
  }

  onLastNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    if (upper !== input.value) {
      const control = this.signupForm.get('lastName');
      control?.setValue(upper, { emitEvent: false });
    }
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
              tap((response) => {
                this.sponsorRegNo = response?.regNo ?? null;
                this.sponsorLookupName = [response?.title, response?.fName, response?.lName]
                  .filter((part): part is string => !!part)
                  .join(' ')
                  .trim();
                if (!this.sponsorLookupName) {
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
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      const addressGroup = this.signupForm.get('address') as FormGroup;
      if (addressGroup) {
        Object.keys(addressGroup.controls).forEach(key => {
          const control = addressGroup.controls[key];
          if (control) {
            control.markAsTouched();
          }
        });
      }
      return;
    }

    this.isLoading = true;
    const formValue = this.signupForm.getRawValue();
    const addressValue = formValue.address;

    const payload: RegisterMemberPayload = {
      bussinessCategoryId: this.getBusinessCategoryId(formValue.businessCategory ?? ''),
      introRegNo: Number(formValue.sponsorId),
      personInfo: {
        title: formValue.title ?? '',
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        gender: formValue.gender === 'male' ? 1 : 2,
        primaryContactNumber: (formValue.phone ?? '').replace(/\s/g, ''),
        aadhaarNo: (formValue.aadhaarNo ?? '').replace(/\s/g, ''),
        panCard: formValue.panCard ?? '',
        emailId: formValue.email ?? '',
      },
      address: {
        houseNo: addressValue?.addressLine1 ?? '',
        street: addressValue?.addressLine2 || '',
        city: addressValue?.city ?? '',
        state: addressValue?.state ?? '',
        countryId: 0,
        stateId: 0,
        cityId: 0,
        zipCode: addressValue?.postalCode ?? '',
        distId: 0,
      },
      introSide: formValue.position === 'left' ? 'L' : 'R',
    };

    this.signupService
      .registerMember(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          // Handle error - could show toast notification
        },
      });
  }

  private getBusinessCategoryId(category: string): number {
    const categoryMap: Record<string, number> = {
      'real-estate': 1,
      construction: 2,
      'interior-decor': 3,
    };
    return categoryMap[category] || 0;
  }
}

