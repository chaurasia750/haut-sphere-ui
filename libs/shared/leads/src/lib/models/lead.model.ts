export interface KpiCard {
  label: string;
  value: number;
  icon: string;
  growth: number;
  color: string;
}

export type LeadStatus = 'new' | 'hot' | 'warm' | 'cold' | 'converted' | 'lost';

export interface StatusBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  leads: number;
  conversions: number;
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  status: LeadStatus;
  assignedUser: string;
  followupDate: string;
  city: string;
  expectedAmount: number;
}
