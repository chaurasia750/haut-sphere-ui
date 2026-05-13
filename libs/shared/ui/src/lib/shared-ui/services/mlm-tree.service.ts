import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@app/shell/environments/api.dev.config';

export interface Member {
  id: number;
  name: string;
  role: string;
  pkg: string;
  img: string;
  status: string;
  registrationNumber?: string;
  parentId: number | null;
  placement: 'left' | 'right' | null;
  level: number;
  isEmpty: boolean;
  hasChildren: boolean;
  leftChildExists?: boolean;
  rightChildExists?: boolean;
  volume?: number;
  earnings?: number;
  online?: boolean;
  income?: number;
  rankIndex?: number;
  childrenCount?: number;
}

export interface MemberDetail extends Member {
  upline: { id: number; name: string; role: string }[];
}

export interface TreeResponse {
  root: Member;
  members: Member[];
  meta: { rootId: number; depth: number; totalMembers: number; returned: number; maxDepth: number; rootTotal: number };
}

export interface SubtreeResponse {
  parentId: number;
  members: Member[];
  depth: number;
  returned: number;
}

export interface SearchResponse {
  results: Member[];
  query: string;
  total: number;
  limit: number;
}

export interface UplineResponse {
  path: { id: number; name: string; role: string }[];
}

export interface StatsResponse {
  rootId: number;
  rootName: string;
  totalDescendants: number;
  maxDepth: number;
  leftCount: number;
  rightCount: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
  byPlacement: { left: number; right: number };
}

function toNumberId(id: string): number {
  const n = Number(id);
  return Number.isFinite(n) ? n : hashId(id) >>> 0;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return h;
}

function toPlacement(placement: string | null): 'left' | 'right' | null {
  if (placement === 'L') return 'left';
  if (placement === 'R') return 'right';
  return placement as 'left' | 'right' | null;
}

function toStatus(status: any): string {
  const s = String(status);
  if (s === '1') return 'Active';
  if (s === '2') return 'Pending';
  if (s === '3') return 'Deactivated';
  return s;
}

interface ApiMember {
  id: string;
  registrationNumber?: string | null;
  name: string;
  role: string | null;
  package: string | null;
  image: string | null;
  status: string;
  parentId: string | null;
  placement: string | null;
  level: number;
  isEmpty: boolean;
  hasChildren: boolean;
  leftChildExists: boolean;
  rightChildExists: boolean;
  childrenCount: number;
  earnings?: number;
  volume?: number;
  online?: boolean;
  income?: number;
  rankIndex?: number;
}

interface ApiTreeData {
  root: ApiMember;
  members: ApiMember[];
  meta: { rootId: number; depth: number; totalMembers: number; returned: number; maxDepth?: number; rootTotal?: number };
}



function mapMember(api: ApiMember): Member {
  const isEmpty = api.isEmpty === true;
  return {
    id: toNumberId(api.id),
    name: isEmpty ? '' : api.name,
    role: isEmpty ? '' : String(api.role ?? ''),
    registrationNumber: isEmpty ? '' : (api.registrationNumber ?? ''),
    pkg: isEmpty ? '' : (api.package ?? ''),
    img: isEmpty ? '' : (api.image ?? ''),
    status: isEmpty ? '' : toStatus(api.status),
    parentId: api.parentId ? toNumberId(api.parentId) : null,
    placement: toPlacement(api.placement),
    level: api.level,
    isEmpty,
    hasChildren: api.hasChildren,
    leftChildExists: api.leftChildExists,
    rightChildExists: api.rightChildExists,
    volume: 0,
    earnings: 0,
    online: false,
    income: 0,
    rankIndex: 0,
    childrenCount: api.childrenCount,
  };
}

function mapTreeData(api: ApiTreeData): TreeResponse {
  const root = mapMember(api.root);
  const members = api.members.filter(m => m.id !== api.root.id).map(mapMember);
  return {
    root,
    members: [root, ...members],
    meta: {
      rootId: api.meta.rootId,
      depth: api.meta.depth,
      totalMembers: api.meta.totalMembers,
      returned: api.meta.returned,
      maxDepth: api.meta.maxDepth ?? api.meta.depth,
      rootTotal: api.meta.rootTotal ?? api.meta.totalMembers,
    },
  };
}

export const MLM_TREE_API_BASE_URL = new InjectionToken<string>('MLM_TREE_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/binary-tree`,
});

@Injectable({ providedIn: 'root' })
export class MlmTreeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(MLM_TREE_API_BASE_URL);

  private unwrap<T>(res: any): T {
    return (res?.data ?? res) as T;
  }

  getTree(rootId: number, depth: number): Observable<TreeResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/${rootId}`, { params: { depth } })
      .pipe(map((res) => mapTreeData(this.unwrap<ApiTreeData>(res))));
  }

  getSubtree(rootId: number, parentId: number, depth: number): Observable<SubtreeResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/subtree`, { params: { parentId, depth } })
      .pipe(map((res) => {
        const d = this.unwrap<ApiTreeData>(res);
        return { parentId, depth: d?.meta?.depth ?? depth, members: d?.members?.map(mapMember) ?? [], returned: d?.meta?.returned ?? 0 };
      }));
  }

  getMember(id: number): Observable<MemberDetail> {
    return this.http
      .get<any>(`${this.baseUrl}/members/${id}`)
      .pipe(map((res) => {
        const d = this.unwrap<any>(res);
        return { ...mapMember(d), upline: d.upline ?? [] };
      }));
  }

  search(query: string, limit = 15): Observable<SearchResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/members/search`, { params: { q: query, limit } })
      .pipe(map((res) => {
        const d = this.unwrap<any>(res);
        return { results: d?.members?.map(mapMember) ?? [], query, total: d?.meta?.totalMembers ?? d?.total ?? 0, limit };
      }));
  }

  getUpline(id: number): Observable<UplineResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/members/${id}/upline`)
      .pipe(map((res) => {
        const d = this.unwrap<any>(res);
        const items = d.path ?? d.upline ?? [];
        return {
          path: items.map((item: any) => ({
            id: item.id,
            name: item.name,
            role: item.registrationNumber ?? item.role ?? '',
          })),
        };
      }));
  }

  getStats(rootId: number): Observable<StatsResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/${rootId}/stats`)
      .pipe(map((res) => this.unwrap<StatsResponse>(res)));
  }
}
