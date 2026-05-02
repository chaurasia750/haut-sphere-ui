import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddressLookupItem {
  countryName: string;
  stateName: string;
  cityName: string;
  pincode: string;
}

export const ADDRESS_LOOKUP_API_BASE_URL = new InjectionToken<string>(
  'ADDRESS_LOOKUP_API_BASE_URL'
);

@Injectable({ providedIn: 'root' })
export class AddressLookupService {
  constructor(
    private readonly http: HttpClient,
    @Inject(ADDRESS_LOOKUP_API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  getAddressByPinCode(pinCode: string): Observable<AddressLookupItem[]> {
    return this.http.get<AddressLookupItem[]>(
      `${this.apiBaseUrl}/locations/addresses?pinCode=${encodeURIComponent(pinCode)}`
    );
  }
}
