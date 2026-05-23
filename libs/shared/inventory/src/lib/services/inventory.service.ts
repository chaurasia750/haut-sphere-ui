import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { PropertyField, PropertyTypeItem } from '../models/property-field.model';
import { PropertyDetail, PropertyListItem, ApiResponse, PaginatedData, InventoryListRequest } from '../models/property-detail.model';

export const INVENTORY_API_BASE_URL = new InjectionToken<string>('INVENTORY_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/inventory`,
});

export const INVENTORY_SERVICE = new InjectionToken<IInventoryService>('INVENTORY_SERVICE', {
  factory: () => inject(InventoryService),
});

export interface CreateInventoryField {
  propertyFieldId: number;
  value: string;
}

export interface CreateInventoryPayload {
  propertyTypeId: number;
  title: string;
  description: string;
  fields: CreateInventoryField[];
  documentIds: number[];
  profileId: number;
  status?: string;
}

export interface IInventoryService {
  getPropertyTypes(): Observable<PropertyTypeItem[]>;
  getPropertyFields(propertyTypeId: string | number): Observable<PropertyField[]>;
  getPropertyList(request: InventoryListRequest): Observable<PaginatedData<PropertyListItem>>;
  createInventory(payload: CreateInventoryPayload): Observable<PropertyDetail>;
  updateProperty(id: number, payload: CreateInventoryPayload): Observable<PropertyDetail>;
  getPropertyById(id: number): Observable<PropertyDetail>;
  activateProperty(id: number): Observable<unknown>;
  deactivateProperty(id: number): Observable<unknown>;
  closeProperty(id: number): Observable<unknown>;
}

@Injectable({ providedIn: 'root' })
export class InventoryService implements IInventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(INVENTORY_API_BASE_URL);

  getPropertyTypes(): Observable<PropertyTypeItem[]> {
    return this.http.get<PropertyTypeItem[]>(`${this.baseUrl}/property-types`);
  }

  getPropertyFields(propertyTypeId: string | number): Observable<PropertyField[]> {
    return this.http.get<PropertyField[]>(`${this.baseUrl}/property-fields/property-type/${propertyTypeId}`);
  }

  getPropertyList(request: InventoryListRequest): Observable<PaginatedData<PropertyListItem>> {
    let params = new HttpParams()
      .set('PageIndex', request.pageIndex)
      .set('PageSize', request.pageSize);

    if (request.propertyTypeId != null) params = params.set('PropertyTypeId', request.propertyTypeId);
    if (request.title) params = params.set('Title', request.title);
    if (request.sortingOrder) params = params.set('SortingOrder', request.sortingOrder);
    if (request.colName) params = params.set('ColName', request.colName);

    return this.http.get(`${this.baseUrl}/property/list`, { params }).pipe(
      map((res: any) => {
        const paginatedData = res?.data ?? res?.Data ?? res;
        const rawItems: any[] = paginatedData?.items ?? paginatedData?.Items ?? [];
        const items: PropertyListItem[] = rawItems.map((item: any) => ({
          id: item.id ?? item.Id,
          title: item.title ?? item.Title ?? '',
          propertyType: item.propertyType ?? item.PropertyType ?? '',
          status: item.status ?? item.Status ?? null,
          createdAt: item.createdAt ?? item.CreatedAt ?? '',
          description: item.description ?? item.Description ?? undefined,
          profileImageId: item.profileImageId ?? item.ProfileImageId ?? null,
        }));
        return {
          items,
          pageIndex: paginatedData?.pageIndex ?? paginatedData?.PageIndex ?? 1,
          pageSize: paginatedData?.pageSize ?? paginatedData?.PageSize ?? 20,
          totalCount: paginatedData?.totalCount ?? paginatedData?.TotalCount ?? 0,
          totalPages: paginatedData?.totalPages ?? paginatedData?.TotalPages ?? 0,
          indexFrom: paginatedData?.indexFrom ?? paginatedData?.IndexFrom ?? 0,
          hasPreviousPage: paginatedData?.hasPreviousPage ?? paginatedData?.HasPreviousPage ?? false,
          hasNextPage: paginatedData?.hasNextPage ?? paginatedData?.HasNextPage ?? false,
        } as PaginatedData<PropertyListItem>;
      }),
    );
  }

  createInventory(payload: CreateInventoryPayload): Observable<PropertyDetail> {
    return this.http.post<PropertyDetail>(`${this.baseUrl}/property/create`, payload);
  }

  updateProperty(id: number, payload: CreateInventoryPayload): Observable<PropertyDetail> {
    return this.http.put<PropertyDetail>(`${this.baseUrl}/property/${id}`, payload);
  }

  getPropertyById(id: number): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.baseUrl}/property/${id}`);
  }

  activateProperty(id: number): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/property/${id}/activate`, {});
  }

  deactivateProperty(id: number): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/property/${id}/deactivate`, {});
  }

  closeProperty(id: number): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/property/${id}/close`, {});
  }
}
