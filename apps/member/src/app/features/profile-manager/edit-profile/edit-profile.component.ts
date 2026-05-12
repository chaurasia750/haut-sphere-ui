import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import {
  SharedAddressFormComponent,
  SharedTitleSelectComponent,
} from '@shared/ui/src';
import { apiConfig } from '@app/shell/environments/api.dev.config';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { MemberProfile, MemberProfileService, UpdateProfilePayload } from '../../../shared/services/member-profile.service';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageBreadcrumbComponent,
    SharedAddressFormComponent,
    SharedTitleSelectComponent,
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit, AfterViewInit {
  isLoading = false;
  isSaving = false;
  updateSuccess = false;
  updateError = '';
  profile: MemberProfile | null = null;

  @ViewChildren('formInput') formInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly editForm = this.fb.group({
    title: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    adharNo: [''],
    memPan: [''],
    address: this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      country: [{ value: 'India', disabled: true }, Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
    }),
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly memberProfileService: MemberProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  readonly apiBaseUrl = apiConfig.baseUrl;

  get addressGroup() {
    return this.editForm.controls.address;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    //this.syncNativeInputs();
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.memberProfileService.getProfile().pipe(take(1)).subscribe({
      next: (p) => {
        this.profile = p;
        this.populateForm(p);
        this.isLoading = false;
        this.cdr.markForCheck();
       // this.syncNativeInputs();
      },
      error: (err) => {
        console.error('[EditProfile] Failed to load profile:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private populateForm(profile: MemberProfile): void {
    const genderValue = profile.gender === '1' ? 'male' : profile.gender === '2' ? 'female' : '';

    const phoneRaw = (profile.primaryContactNumber ?? '').replace(/\D/g, '');
    const phone = phoneRaw.length === 10
      ? `${phoneRaw.slice(0, 4)} ${phoneRaw.slice(4, 8)} ${phoneRaw.slice(8)}`



    : '';
const aadhaarRaw = (profile.aadhaarNo ?? '').replace(/\D/g, '');
const aadhaar = aadhaarRaw.length === 12
  ? `${aadhaarRaw.slice(0, 4)} ${aadhaarRaw.slice(4, 8)} ${aadhaarRaw.slice(8)}`
  : '';

const pan = (profile.panCard ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');






console.log('PAN VALUE =>', profile.panCard );
  

    this.editForm.patchValue({
      title: profile.title || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      gender: genderValue,
      email: profile.emailId || '',
      phone: phone,
     adharNo: aadhaar,
memPan: profile.panCard,

      
    }, { emitEvent: false });

    const addr = profile.address;
    if (addr) {
      this.editForm.patchValue({
        address: {
          addressLine1: addr.houseNo || '',
          addressLine2: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.zipCode || '',
        },
      }, { emitEvent: false });
    }
  }

  onInputPhone(e: Event): void {
    const el = e.target as HTMLInputElement;
    let d = el.value.replace(/\D/g, '').slice(0, 10);
    let v = d;
    if (d.length > 8) v = `${d.slice(0, 4)} ${d.slice(4, 8)} ${d.slice(8)}`;
    else if (d.length > 4) v = `${d.slice(0, 4)} ${d.slice(4)}`;
    el.value = v;
    this.editForm.get('phone')?.setValue(v, { emitEvent: false });
  }

  onInputAadhaar(e: Event): void {
    const el = e.target as HTMLInputElement;
    let d = el.value.replace(/\D/g, '').slice(0, 12);
    let v = d;
    if (d.length > 4) v = d.replace(/(\d{4})(?=\d)/g, '$1 ');
    el.value = v;
    this.editForm.get('adharNo')?.setValue(v, { emitEvent: false });
  }

  onInputPan(e: Event): void {
    const el = e.target as HTMLInputElement;
    const s = el.value.toUpperCase();
    let v = '';
    for (let i = 0; i < s.length && i < 10; i++) {
      const c = s[i];
      if (i < 5 && /[A-Z]/.test(c)) v += c;
      else if (i >= 5 && i < 9 && /[0-9]/.test(c)) v += c;
      else if (i === 9 && /[A-Z]/.test(c)) v += c;
    }
    el.value = v;
    this.editForm.get('memPan')?.setValue(v, { emitEvent: false });
  }

  onInputName(e: Event, ctrl: 'firstName' | 'lastName'): void {
    const el = e.target as HTMLInputElement;
    const u = el.value.toUpperCase();
    if (u !== el.value) {
      this.editForm.get(ctrl)?.setValue(u, { emitEvent: false });
    }
  }

  isInvalid(name: string): boolean {
    const c = this.editForm.get(name);
    return !!(c?.touched && c?.invalid);
  }

  getError(name: string): string {
    const c = this.editForm.get(name);
    if (!c?.touched || !c?.errors) return '';
    if (c.errors['required']) {
      const map: Record<string, string> = {
        title: 'Title', firstName: 'First Name', lastName: 'Last Name',
        gender: 'Gender', email: 'Email', phone: 'Phone',
        adharNo: 'adharNo', memPan: 'memPan',
      };
      return `${map[name] || name} is required.`;
    }
    if (c.errors['email']) return 'Enter a valid email address.';
    return 'Invalid input.';
  }

  submit(): void {
    this.updateSuccess = false;
    this.updateError = '';

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      const ag = this.editForm.get('address') as FormGroup;
      if (ag) Object.keys(ag.controls).forEach(k => ag.controls[k]?.markAsTouched());
      this.updateError = 'Please fill all required fields correctly.';
      this.cdr.markForCheck();
      console.error('[EditProfile] Form is invalid. Errors:', this.getFormErrors());
      return;
    }

    this.isSaving = true;
    const v = this.editForm.getRawValue();

    const payload: UpdateProfilePayload = {
      title: v.title || '',
      firstName: v.firstName || '',
      lastName: v.lastName || '',
      gender: v.gender === 'male' ? 1 : 2,
      primaryContactNumber: (v.phone || '').replace(/\s/g, ''),
      emailId: v.email || '',
      aadhaarNo: (v.adharNo || '').replace(/\s/g, ''),
      panCard: v.memPan || '',
      address: {
        houseNo: v.address?.addressLine1 || '',
        street: v.address?.addressLine2 || '',
        city: v.address?.city || '',
        state: v.address?.state || '',
        zipCode: v.address?.postalCode || '',
      },
    };

    console.log('=== [EditProfile] API Request Debug ===');
    console.log('[EditProfile] HTTP Method: PUT');
    console.log('[EditProfile] URL: https://localhost:7056/members/profile');
    console.log('[EditProfile] Payload:', JSON.stringify(payload, null, 2));
    console.log('[EditProfile] WithCredentials: true');
    console.log('======================================');

    this.memberProfileService.updateProfile(payload).pipe(
      finalize(() => { this.isSaving = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (res) => {
        console.log('[EditProfile] Response SUCCESS:', JSON.stringify(res, null, 2));
        this.updateSuccess = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('=== [EditProfile] API ERROR ===');
        console.error('[EditProfile] Status:', err?.status);
        console.error('[EditProfile] StatusText:', err?.statusText);
        console.error('[EditProfile] Error Body:', JSON.stringify(err?.error, null, 2));
        console.error('[EditProfile] Full Error:', err);
        console.error('===============================');
        this.updateError = `API Error ${err?.status}: ${err?.error?.message || err?.statusText || 'Unknown'}`;
        this.cdr.markForCheck();
      },
    });
  }

  private getFormErrors(): Record<string, any> {
    const errors: Record<string, any> = {};
    Object.keys(this.editForm.controls).forEach(key => {
      const ctrl = this.editForm.get(key);
      if (ctrl?.invalid) {
        errors[key] = { errors: ctrl.errors, touched: ctrl.touched, value: ctrl.value };
      }
    });
    return errors;
  }
}
