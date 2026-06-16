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
  gender: string;
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
  sourceId?: number;
  assignedUserId?: number;
  leadForId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface LeadDetailContact {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  alternateMobile: string;
  email: string;
  stateName: string;
  cityName: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  sourceId?: number;
}

export interface LeadDetailStatus {
  id: number;
  name: string;
  colorCode: string;
}

export interface LeadDetailUser {
  id: number;
  userName: string;
  email: string;
}

export interface LeadDetailTag {
  id: number;
  name: string;
  colorCode: string;
}

export interface LeadDetailActivity {
  id: number;
  subject: string;
  description: string;
  activityType: string;
  activityDate: string;
  nextFollowupDate: string;
  durationMinutes: number;
}

export interface LeadDetailTask {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  completedAt: string | null;
  status: string;
}

export interface LeadDetailNote {
  id: number;
  noteText: string;
}

export interface LeadDetailComment {
  id: number;
  commentText: string;
}

export interface LeadDetail {
  id: number;
  title: string;
  description: string;
  priority: string;
  expectedAmount: number;
  closingProbability: number;
  expectedCloseDate: string;
  nextFollowupDate: string;
  lastActivityDate: string;
  isConverted: boolean;
  createdAt: string;
  modifiedAt: string | null;
  contact: LeadDetailContact;
  status: LeadDetailStatus;
  assignedUser: LeadDetailUser | null;
  createdBy: LeadDetailUser | null;
  leadFor: any | null;
  tags: LeadDetailTag[];
  activities: LeadDetailActivity[];
  tasks: LeadDetailTask[];
  notes: LeadDetailNote[];
  comments: LeadDetailComment[];
}

export interface UpdateLeadResponse {
  message: string;
}

export interface FollowUpItem {
  activityId: number;
  leadId: number;
  leadTitle: string;
  contactName: string;
  contactMobile: string;
  activityType: string;
  activityTypeIcon: string;
  activityTypeColor: string;
  subject: string;
  description: string;
  activityDate: string;
  nextFollowupDate: string;
  durationMinutes: number;
  assignedUserId: number;
  assignedUserName: string;
}

export interface CreateActivityRequest {
  activityTypeId: number;
  subject: string;
  description: string;
  activityDate: string;
  nextFollowupDate?: string;
  durationMinutes: number;
}

export interface UpdateActivityRequest extends CreateActivityRequest {}

export interface ActivityType {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface GetFollowUpsRequest {
  FromDate?: string;
  ToDate?: string;
  AssignedUserId?: number;
  LeadId?: number;
  ActivityTypeId?: number;
  Page?: number;
  PageSize?: number;
}
