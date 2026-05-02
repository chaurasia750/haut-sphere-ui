import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { apiConfig } from '@app/shell/environments/api.dev.config';

export interface SponsorValidationResponse {
  title?: string | null;
  fName?: string | null;
  lName?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = apiConfig.baseUrl;

  validateSponsor(sponsorId: string): Observable<string> {
    return this.http
      .get<SponsorValidationResponse>(
        `${this.apiBaseUrl}/registration-validation/sponser?sponsonrId=${encodeURIComponent(sponsorId)}`
      )
      .pipe(
        map((response) =>
          [response?.title, response?.fName, response?.lName]
            .filter((part): part is string => !!part)
            .join(' ')
            .trim()
        )
      );
  }
}