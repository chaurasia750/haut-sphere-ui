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
  id: number;
  name: string;
  mobile: string;
  email: string;
  status: string;
  assignedUser: string;
  expectedAmount: number;
  nextFollowupDate: string;
  leadForId: number;
  leadForTitle: string;
  createdAt: string;
  createdByName: string;
}
