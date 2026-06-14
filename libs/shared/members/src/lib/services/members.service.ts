import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { GetMembersRequest, MemberListResponse } from '../models/member-api.model';

export const MEMBERS_API_BASE_URL = new InjectionToken<string>('MEMBERS_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/members`,
});

export const MEMBERS_SERVICE = new InjectionToken<IMembersService>('MEMBERS_SERVICE', {
  factory: () => inject(MembersService),
});

export interface IMembersService {
  getMembers(params?: GetMembersRequest): Observable<MemberListResponse>;
}

@Injectable({ providedIn: 'root' })
export class MembersService implements IMembersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(MEMBERS_API_BASE_URL);

  getMembers(params?: GetMembersRequest): Observable<MemberListResponse> {
    const query: Record<string, string | number> = {};
    if (params) {
      if (params.Keyword) query['Keyword'] = params.Keyword;
      if (params.Status !== undefined && params.Status !== null) query['Status'] = params.Status;
      if (params.PageIndex !== undefined) query['PageIndex'] = params.PageIndex;
      if (params.PageSize !== undefined) query['PageSize'] = params.PageSize;
      if (params.SortingOrder !== undefined) query['SortingOrder'] = params.SortingOrder;
      if (params.ColName) query['ColName'] = params.ColName;
    }
    return this.http.get<MemberListResponse>(`${this.baseUrl}/list`, { params: query });
  }
}
