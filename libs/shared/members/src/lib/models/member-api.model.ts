import { Member } from './member.model';

export interface MemberListResponse {
  indexFrom: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: Member[];
}

export interface GetMembersRequest {
  Keyword?: string;
  Status?: number;
  PageIndex?: number;
  PageSize?: number;
  SortingOrder?: number;
  ColName?: string;
}
