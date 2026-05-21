import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { PropertyField, PropertyTypeItem } from '../models/property-field.model';

export const INVENTORY_API_BASE_URL = new InjectionToken<string>('INVENTORY_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/inventory`,
});

export const INVENTORY_SERVICE = new InjectionToken<IInventoryService>('INVENTORY_SERVICE');

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
  createInventory(payload: CreateInventoryPayload): Observable<unknown>;
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

  createInventory(payload: CreateInventoryPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/property/create`, payload);
  }
}
