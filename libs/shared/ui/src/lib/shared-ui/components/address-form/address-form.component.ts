import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap, tap } from 'rxjs';
import { NumberOnlyDirective } from '../../directives/number-only.directive';
import { AddressLookupItem, AddressLookupService } from '../../services/address-lookup.service';

@Component({
  selector: 'shared-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberOnlyDirective],
  templateUrl: './address-form.component.html',
})
export class SharedAddressFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressLookupService = inject(AddressLookupService);

  @Input({ required: true }) formGroup!: FormGroup;

  cityList: string[] = [];
  stateList: string[] = [];
  isPostalLookupPending = false;

  ngOnInit(): void {
    this.setupPostalLookup();
  }

  private setupPostalLookup(): void {
    const postalCodeControl = this.formGroup.get('postalCode');
    if (!postalCodeControl) {
      return;
    }

    postalCodeControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          const normalized = (value ?? '').toString().trim();
          if (normalized !== value) {
            postalCodeControl.setValue(normalized, { emitEvent: false });
          }

          if (normalized.length !== 6) {
            this.clearLocationState();
          }
        }),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          const postalCode = (value ?? '').toString().trim();
          if (postalCode.length !== 6) {
            return of<AddressLookupItem[]>([]);
          }

          this.isPostalLookupPending = true;
          return this.addressLookupService.getAddressByPinCode(postalCode).pipe(
            catchError(() => of<AddressLookupItem[]>([])),
            finalize(() => {
              this.isPostalLookupPending = false;
            })
          );
        })
      )
      .subscribe((locations) => {
        if (!locations?.length) {
          this.clearLocationState();
          return;
        }

        this.stateList = Array.from(new Set(locations.map((item) => item.stateName).filter(Boolean)));
        this.cityList = Array.from(new Set(locations.map((item) => item.cityName).filter(Boolean)));

        if (this.stateList.length) {
          this.formGroup.get('state')?.setValue(this.stateList[0]);
        }

        if (this.cityList.length) {
          this.formGroup.get('city')?.setValue(this.cityList[0]);
        }

        const country = locations[0]?.countryName ?? '';
        this.formGroup.get('country')?.setValue(country);
      });
  }

  private clearLocationState(): void {
    this.isPostalLookupPending = false;
    this.stateList = [];
    this.cityList = [];
    this.formGroup.get('state')?.setValue('');
    this.formGroup.get('city')?.setValue('');
  }
}
