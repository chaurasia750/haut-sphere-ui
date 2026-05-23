export interface PropertyDetailField {
  fieldName: string;
  fieldLabel: string;
  value: string;
}

export interface MediaDetails {
  id: number;
  url: string;
  fileName: string;
  originalFileName: string;
  isPrimary: boolean;
  filePath: string;
  contentType: string;
}

export interface PropertyFile {
  mediaFileId: number;
  propertyFileId: number;
  mediaDetails: MediaDetails | null;
}

export interface ProfileInfo {
  mediaFileId: number;
  propertyFileId: number;
  mediaDetails: MediaDetails | null;
}

export interface PropertyDetail {
  id: number;
  title: string;
  status: string | null;
  isActive: boolean;
  description: string;
  propertyType: number;
  fields: PropertyDetailField[];
  files: PropertyFile[];
  profile: ProfileInfo | null;
}

export interface PropertyListItem {
  id: number;
  title: string;
  propertyType: string;
  status: string | null;
  createdAt: string;
  description?: string;
  profileImageId?: number | null;
}

export interface ApiResponse<T> {
  data: T;
  errorCode: number;
  errorDescription: string | null;
  message: string | null;
  isFeedbackSet: boolean;
}

export interface PaginatedData<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  indexFrom: number;
  items: T[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface InventoryListRequest {
  propertyTypeId?: number | null;
  title?: string;
  pageIndex: number;
  pageSize: number;
  sortingOrder?: SortingOrder;
  colName?: string;
}

export type SortingOrder = 'Asc' | 'Desc';
