import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiConfig } from '@app/shell/environments/api.dev.config';

export interface MemberProfileAddress {
  houseNo: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  countryId: number | null;
  stateId: number | null;
  cityId: number | null;
  districtId: number | null;
}

export interface MemberProfile {
  id: number;
  registrationNumber: string | null;
  registrationDate: string | null;
  loginId: string | null;
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  primaryContactNumber: string | null;
  secondaryContactNumber: string | null;
  emailId: string | null;
  introRegNo: string | null;
  introSide: string | null;
  address: MemberProfileAddress | null;
}

@Injectable({
  providedIn: 'root',
})
export class MemberProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/members`;

  getProfile(): Observable<MemberProfile> {
    return this.http
      .get<unknown>(`${this.baseUrl}/profile`, { withCredentials: true })
      .pipe(map((response) => this.normalizeProfileResponse(response)));
  }

  private normalizeProfileResponse(response: unknown): MemberProfile {
    const root = this.asObject(response);
    const payload = this.asObject(root.data ?? root.profile ?? root.memberProfile ?? root.member ?? root);
    const address = this.asObject(payload.address ?? payload.memberAddress ?? null);

    return {
      id: this.toNumber(payload.id) ?? 0,
      registrationNumber: this.toString(payload.registrationNumber ?? payload.registration_no),
      registrationDate: this.toString(payload.registrationDate ?? payload.registration_date),
      loginId: this.toString(payload.loginId ?? payload.login_id ?? payload.username),
      title: this.toString(payload.title),
      firstName: this.toString(payload.firstName ?? payload.first_name),
      lastName: this.toString(payload.lastName ?? payload.last_name),
      dateOfBirth: this.toString(payload.dateOfBirth ?? payload.date_of_birth ?? payload.dob),
      gender: this.toString(payload.gender),
      primaryContactNumber: this.toString(
        payload.primaryContactNumber ?? payload.primary_contact_number ?? payload.mobile
      ),
      secondaryContactNumber: this.toString(
        payload.secondaryContactNumber ?? payload.secondary_contact_number ?? payload.altMobile
      ),
      emailId: this.toString(payload.emailId ?? payload.email_id ?? payload.email),
      introRegNo: this.toString(payload.introRegNo ?? payload.intro_reg_no),
      introSide: this.toString(payload.introSide ?? payload.intro_side),
      address: this.isEmptyObject(address)
        ? null
        : {
            houseNo: this.toString(address.houseNo ?? address.house_no),
            street: this.toString(address.street ?? address.addressLine1 ?? address.address_line_1),
            city: this.toString(address.city ?? address.cityName),
            state: this.toString(address.state ?? address.stateName),
            zipCode: this.toString(address.zipCode ?? address.zip_code ?? address.pinCode),
            countryId: this.toNumber(address.countryId ?? address.country_id),
            stateId: this.toNumber(address.stateId ?? address.state_id),
            cityId: this.toNumber(address.cityId ?? address.city_id),
            districtId: this.toNumber(address.districtId ?? address.district_id),
          },
    };
  }

  private asObject(value: unknown): any {
    return value && typeof value === 'object' ? value : {};
  }

  private isEmptyObject(value: any): boolean {
    return Object.keys(value).length === 0;
  }

  private toString(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
}
