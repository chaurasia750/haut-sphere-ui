export interface AddLeadCustomerInfo {
  firstName: string;
  lastName: string;
  mobile: string;
  alternateMobile: string;
  email: string;
  stateName: string;
  cityName: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
}

export interface AddLeadRequest {
  customerInfo: AddLeadCustomerInfo;
  title: string;
  description: string;
  leadForId: number;
  statusId: number;
  priority: string;
  expectedAmount: number;
  closingProbability: number;
  expectedCloseDate: string;
  nextFollowupDate: string;
  assignedUserId: number;
  sourceId: number;
  note: string;
  tagIds: number[];
}

export interface AddLeadResponse {
  id: number;
  message?: string;
}

export interface LeadLookupItem {
  id: number;
  name: string;
  colorCode?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetLeadsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  statusId?: number;
  assignedUserId?: number;
  leadForId?: number;
  fromDate?: string;
  toDate?: string;
  followupFromDate?: string;
  followupToDate?: string;
}
