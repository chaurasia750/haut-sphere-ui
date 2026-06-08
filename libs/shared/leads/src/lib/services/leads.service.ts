import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';
import { KpiCard, Lead, StatusBreakdown, MonthlyTrend } from '../models/lead.model';
import { AddLeadRequest, AddLeadResponse } from '../models/lead-api.model';

export const LEAD_API_BASE_URL = new InjectionToken<string>('LEAD_API_BASE_URL', {
  factory: () => `${apiConfig.baseUrl}/leads`,
});

export const LEADS_SERVICE = new InjectionToken<ILeadsService>('LEADS_SERVICE', {
  factory: () => inject(LeadsService),
});

export interface ILeadsService {
  getKpiCards(): Observable<KpiCard[]>;
  getLeadStatuses(): Observable<StatusBreakdown[]>;
  getMonthlyTrends(): Observable<MonthlyTrend[]>;
  getRecentLeads(): Observable<Lead[]>;
  getLeads(): Observable<Lead[]>;
  addLead(payload: AddLeadRequest): Observable<AddLeadResponse>;
}

@Injectable({ providedIn: 'root' })
export class LeadsService implements ILeadsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(LEAD_API_BASE_URL);

  getKpiCards(): Observable<KpiCard[]> {
    return of([
      { label: 'Total Leads', value: 1248, icon: 'users', growth: 12.5, color: '#339AF0' },
      { label: 'Hot Leads', value: 186, icon: 'fire', growth: 8.2, color: '#FF6B6B' },
      { label: 'Follow-ups Today', value: 43, icon: 'phone', growth: -3.1, color: '#FFC107' },
      { label: 'Converted', value: 527, icon: 'check', growth: 15.7, color: '#51CF66' },
      { label: 'Expected Revenue', value: 14500000, icon: 'dollar', growth: 22.4, color: '#CC5DE8' },
    ]);
  }

  getLeadStatuses(): Observable<StatusBreakdown[]> {
    return of([
      { label: 'New', value: 342, color: '#339AF0' },
      { label: 'Hot', value: 186, color: '#FF6B6B' },
      { label: 'Warm', value: 251, color: '#FFC107' },
      { label: 'Cold', value: 198, color: '#868E96' },
      { label: 'Converted', value: 527, color: '#51CF66' },
      { label: 'Lost', value: 112, color: '#F06595' },
    ]);
  }

  getMonthlyTrends(): Observable<MonthlyTrend[]> {
    return of([
      { month: 'Jan', leads: 180, conversions: 65 },
      { month: 'Feb', leads: 200, conversions: 78 },
      { month: 'Mar', leads: 165, conversions: 55 },
      { month: 'Apr', leads: 220, conversions: 92 },
      { month: 'May', leads: 195, conversions: 74 },
      { month: 'Jun', leads: 240, conversions: 105 },
      { month: 'Jul', leads: 210, conversions: 88 },
      { month: 'Aug', leads: 260, conversions: 120 },
      { month: 'Sep', leads: 230, conversions: 95 },
      { month: 'Oct', leads: 280, conversions: 130 },
      { month: 'Nov', leads: 250, conversions: 110 },
      { month: 'Dec', leads: 310, conversions: 145 },
    ]);
  }

  getRecentLeads(): Observable<Lead[]> {
    return of([
      { id: 'L-1024', name: 'Anita Verma', mobile: '+91-98765-43210', status: 'hot', assignedUser: 'Vikram Patel', followupDate: 'Today 3:00 PM', city: 'Mumbai', expectedAmount: 850000 },
      { id: 'L-1023', name: 'Ravi Kumar', mobile: '+91-99887-76655', status: 'new', assignedUser: 'Anita Sharma', followupDate: 'Tomorrow 10:00 AM', city: 'Delhi', expectedAmount: 450000 },
      { id: 'L-1022', name: 'Sunita Das', mobile: '+91-87654-32109', status: 'converted', assignedUser: 'Rajesh Kumar', followupDate: 'Completed', city: 'Kolkata', expectedAmount: 1200000 },
      { id: 'L-1021', name: 'Prakash Joshi', mobile: '+91-78901-23456', status: 'warm', assignedUser: 'Neha Gupta', followupDate: 'May 20, 2026', city: 'Pune', expectedAmount: 230000 },
      { id: 'L-1020', name: 'Meena Iyer', mobile: '+91-89012-34567', status: 'cold', assignedUser: 'Vikram Patel', followupDate: 'May 22, 2026', city: 'Chennai', expectedAmount: 625000 },
    ]);
  }

  getLeads(): Observable<Lead[]> {
    return of([
      { id: 'L-1040', name: 'Arun Nair', mobile: '+91-98765-43210', status: 'hot', assignedUser: 'Vikram Patel', followupDate: 'Today 3:00 PM', city: 'Mumbai', expectedAmount: 850000 },
      { id: 'L-1039', name: 'Bhavna Shah', mobile: '+91-99887-76655', status: 'new', assignedUser: 'Anita Sharma', followupDate: 'Tomorrow 10:00 AM', city: 'Delhi', expectedAmount: 450000 },
      { id: 'L-1038', name: 'Chirag Mehta', mobile: '+91-87654-32109', status: 'converted', assignedUser: 'Rajesh Kumar', followupDate: 'Completed', city: 'Kolkata', expectedAmount: 1200000 },
      { id: 'L-1037', name: 'Deepa Reddy', mobile: '+91-78901-23456', status: 'warm', assignedUser: 'Neha Gupta', followupDate: 'May 20, 2026', city: 'Pune', expectedAmount: 230000 },
      { id: 'L-1036', name: 'Emmanuel D\'Souza', mobile: '+91-89012-34567', status: 'cold', assignedUser: 'Vikram Patel', followupDate: 'May 22, 2026', city: 'Chennai', expectedAmount: 625000 },
      { id: 'L-1035', name: 'Farah Khan', mobile: '+91-90123-45678', status: 'hot', assignedUser: 'Anita Sharma', followupDate: 'May 18, 2026', city: 'Mumbai', expectedAmount: 975000 },
      { id: 'L-1034', name: 'Gautam Das', mobile: '+91-81234-56789', status: 'new', assignedUser: 'Rajesh Kumar', followupDate: 'May 25, 2026', city: 'Bangalore', expectedAmount: 310000 },
      { id: 'L-1033', name: 'Heena Kapoor', mobile: '+91-72345-67890', status: 'lost', assignedUser: 'Neha Gupta', followupDate: 'Lost', city: 'Delhi', expectedAmount: 540000 },
      { id: 'L-1032', name: 'Irfan Malik', mobile: '+91-63456-78901', status: 'warm', assignedUser: 'Vikram Patel', followupDate: 'Jun 1, 2026', city: 'Hyderabad', expectedAmount: 180000 },
      { id: 'L-1031', name: 'Jyoti Gaikwad', mobile: '+91-54567-89012', status: 'new', assignedUser: 'Anita Sharma', followupDate: 'May 19, 2026', city: 'Pune', expectedAmount: 765000 },
      { id: 'L-1030', name: 'Karan Arora', mobile: '+91-45678-90123', status: 'converted', assignedUser: 'Rajesh Kumar', followupDate: 'Completed', city: 'Mumbai', expectedAmount: 1500000 },
      { id: 'L-1029', name: 'Lata Shenoy', mobile: '+91-36789-01234', status: 'cold', assignedUser: 'Neha Gupta', followupDate: 'Jun 5, 2026', city: 'Bangalore', expectedAmount: 420000 },
      { id: 'L-1028', name: 'Mohan Lal', mobile: '+91-27890-12345', status: 'hot', assignedUser: 'Vikram Patel', followupDate: 'Today 5:30 PM', city: 'Chennai', expectedAmount: 1125000 },
      { id: 'L-1027', name: 'Nisha Singh', mobile: '+91-18901-23456', status: 'warm', assignedUser: 'Anita Sharma', followupDate: 'May 23, 2026', city: 'Delhi', expectedAmount: 345000 },
      { id: 'L-1026', name: 'Omkar Desai', mobile: '+91-09012-34567', status: 'new', assignedUser: 'Rajesh Kumar', followupDate: 'May 21, 2026', city: 'Surat', expectedAmount: 520000 },
    ]);
  }

  addLead(payload: AddLeadRequest): Observable<AddLeadResponse> {
    return this.http.post<AddLeadResponse>(this.baseUrl, payload);
  }
}
