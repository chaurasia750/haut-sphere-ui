import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { PropertyField, PropertyTypeItem } from '../models/property-field.model';

export const INVENTORY_API_BASE_URL = new InjectionToken<string>('INVENTORY_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/inventory`,
});

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(INVENTORY_API_BASE_URL);

  getPropertyTypes(): Observable<PropertyTypeItem[]> {
    return this.http.get<PropertyTypeItem[]>(`${this.baseUrl}/property-types`);
  }

  getPropertyFields(propertyTypeId: string | number): Observable<PropertyField[]> {
    return this.http.get<PropertyField[]>(`${this.baseUrl}/property-fields/property-type/${propertyTypeId}`);
  }
}
