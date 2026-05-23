import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { PropertyField, PropertyTypeItem } from '../models/property-field.model';
import { PropertyDetail, PropertyListItem, PaginatedData, InventoryListRequest } from '../models/property-detail.model';

export const INVENTORY_API_BASE_URL = new InjectionToken<string>('INVENTORY_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/inventory`,
});

export const INVENTORY_SERVICE = new InjectionToken<IInventoryService>('INVENTORY_SERVICE', {
  factory: () => inject(InventoryService),
});

export const enum PropertyStatus {
  Active = 1,
  Draft = 2,
  Closed = 3,
}

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

    return this.http.get<PaginatedData<PropertyListItem>>(`${this.baseUrl}/property/list`, { params }).pipe(
      map(paginatedData => ({
        ...paginatedData,
        items: (paginatedData.items ?? []).map(item => ({
          id: item.id ?? (item as any).Id,
          title: item.title ?? (item as any).Title ?? '',
          propertyType: item.propertyType ?? (item as any).PropertyType ?? '',
          status: item.status ?? (item as any).Status ?? null,
          createdAt: item.createdAt ?? (item as any).CreatedAt ?? '',
          description: item.description ?? (item as any).Description ?? undefined,
          profileImageId: item.profileImageId ?? (item as any).ProfileImageId ?? null,
        })),
      })),
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
