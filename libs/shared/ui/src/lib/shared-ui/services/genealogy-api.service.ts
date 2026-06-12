import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { ApiMember } from '../models/genealogy-api.model';

export interface TreeNode {
  id: number;
  name: string;
  memberCode: string;
  parentId: number | null;
  hasChildren: boolean;
  childrenCount: number;
  children: TreeNode[];
}

function mapMember(a: ApiMember): TreeNode {
  return {
    id: Number(a.id),
    name: a.fullName || '',
    memberCode: a.memberCode || '',
    parentId: a.parentId ? Number(a.parentId) : null,
    hasChildren: a.hasChildren,
    childrenCount: a.childrenCount || 0,
    children: [],
  };
}

@Injectable({ providedIn: 'root' })
export class GenealogyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/genealogy`;

  getNode(id: number): Observable<TreeNode> {
    return this.http.get<ApiMember>(`${this.baseUrl}/node/${id}`).pipe(
      map((res) => mapMember(res)),
    );
  }
}
