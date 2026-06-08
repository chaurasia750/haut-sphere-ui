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
