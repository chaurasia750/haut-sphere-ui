import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<MemberProfile>(`${this.baseUrl}/profile`, { withCredentials: true });
  }
}
