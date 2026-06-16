import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { ApiMember } from '../models/genealogy-api.model';

export interface TreeNode {
  id: number;
  memberId: string;
  name: string;
  registrationNumber: string;
  joiningDate: string;
  parentId: string | null;
  hasChildren: boolean;
  childrenCount: number;
  children: TreeNode[];
}

export interface SearchResult {
  id: number;
  memberId: string;
  name: string;
  registrationNumber: string;
  joiningDate: string;
}

function toNumberId(id: string | null | undefined): number {
  if (id == null) return 0;
  const n = Number(id);
  return Number.isFinite(n) ? n : hashId(id) >>> 0;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return h;
}

function getJoinDate(a: any): string {
  return a.joiningDate || a.joinDate || a.registrationDate || a.createdDate || '';
}

function mapMember(a: ApiMember): TreeNode {
  return {
    id: toNumberId(a.id),
    memberId: a.id,
    name: a.fullName || '',
    registrationNumber: a.registrationNumber || a.regNo || '',
    joiningDate: getJoinDate(a),
    parentId: a.parentId || null,
    hasChildren: a.hasChildren,
    childrenCount: a.childrenCount || 0,
    children: [],
  };
}

function mapSearchResult(a: ApiMember): SearchResult {
  return {
    id: toNumberId(a.id),
    memberId: a.id,
    name: a.fullName || '',
    registrationNumber: a.registrationNumber || a.regNo || '',
    joiningDate: getJoinDate(a),
  };
}

@Injectable({ providedIn: 'root' })
export class GenealogyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/genealogy`;

  getNode(memberId: string): Observable<TreeNode> {
    return this.http.get<any>(`${this.baseUrl}/node/${memberId}`).pipe(
      map((res) => {
        const d = res?.data ?? res;
        return mapMember(d?.node ?? d);
      }),
    );
  }

  expandNode(memberId: string): Observable<TreeNode[]> {
    return this.http.get<any>(`${this.baseUrl}/expand/${memberId}`).pipe(
      map((res) => {
        const d = res?.data ?? res;
        const items = Array.isArray(d) ? d : d?.children ?? [];
        return items.map(mapMember);
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
