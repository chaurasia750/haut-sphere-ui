import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';

export interface SponsorValidationResponse {
  intoRegNo: number;
  title: string | null;
  fName: string | null;
  lName: string | null;
  franchiseeId: number | null;
}

export interface RegisterMemberResponse {
  registrationNumber: string;
}

export interface RegisterMemberPayload {
  bussinessCategoryId: number;
  introRegNo: number;
  personInfo: {
    title: string;
    firstName: string;
    lastName: string;
    gender: number;
    primaryContactNumber: string;
    aadhaarNo: string;
    panCard: string;
    emailId: string;
  };
  address: {
    houseNo: string;
    street: string;
    city: string;
    state: string;
    countryId: number;
    stateId: number;
    cityId: number;
    zipCode: string;
    distId: number;
  };
  introSide: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = apiConfig.baseUrl;

  validateSponsor(sponsorId: string): Observable<SponsorValidationResponse> {
    return this.http
      .get<SponsorValidationResponse>(
        `${this.apiBaseUrl}/registration-validation/sponser?sponsonrId=${encodeURIComponent(sponsorId)}`
      );
  }

  registerMember(payload: RegisterMemberPayload): Observable<RegisterMemberResponse> {
    return this.http.post<RegisterMemberResponse>(`${this.apiBaseUrl}/members/registration`, payload);
  }
}