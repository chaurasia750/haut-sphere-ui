import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { ApiMember } from '../models/genealogy-api.model';

export interface TreeNode {
  id: number;
  name: string;
  registrationNumber: string;
  joiningDate: string;
  parentId: number | null;
  hasChildren: boolean;
  childrenCount: number;
  children: TreeNode[];
}

export interface SearchResult {
  id: number;
  name: string;
  registrationNumber: string;
  joiningDate: string;
}

function getJoinDate(a: any): string {
  return a.joiningDate || a.joinDate || a.registrationDate || a.createdDate || '';
}

function mapMember(a: ApiMember): TreeNode {
  return {
    id: Number(a.id),
    name: a.fullName || '',
    registrationNumber: a.registrationNumber || a.regNo || '',
    joiningDate: getJoinDate(a),
    parentId: a.parentId ? Number(a.parentId) : null,
    hasChildren: a.hasChildren,
    childrenCount: a.childrenCount || 0,
    children: [],
  };
}

function mapSearchResult(a: ApiMember): SearchResult {
  return {
    id: Number(a.id),
    name: a.fullName || '',
    registrationNumber: a.registrationNumber || a.regNo || '',
    joiningDate: getJoinDate(a),
  };
}

@Injectable({ providedIn: 'root' })
export class GenealogyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/genealogy`;

  getNode(id: number): Observable<TreeNode> {
    return this.http.get<any>(`${this.baseUrl}/node/${id}`).pipe(
      map((res) => {
        const d = res?.data ?? res;
        return mapMember(d?.node ?? d);
      }),
    );
  }

  search(query: string, limit = 15): Observable<SearchResult[]> {
    return this.http.get<any>(`${this.baseUrl}/members/search`, {
      params: { q: query, limit },
    }).pipe(
      map((res) => {
        const d = res?.data ?? res;
        const items = Array.isArray(d) ? d : d?.items ?? d?.results ?? [];
        return items.map(mapSearchResult);
      }),
    );
  }
}
