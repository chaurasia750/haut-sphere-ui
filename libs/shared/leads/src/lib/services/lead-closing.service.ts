import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadBookingInfo, LeadClosingRequest } from '../models/lead-closing.model';

@Injectable({ providedIn: 'root' })
export class LeadClosingService {
  private readonly http = inject(HttpClient);

  getBookingInfo(leadId: number): Observable<LeadBookingInfo> {
    return this.http.get<LeadBookingInfo>(`/api/leads/${leadId}/booking-info`);
  }

  getClosingRequest(leadId: number): Observable<LeadClosingRequest> {
    return this.http.get<LeadClosingRequest>(`/api/leads/${leadId}/closing`);
  }

  saveDraft(leadId: number, data: Partial<LeadClosingRequest>): Observable<LeadClosingRequest> {
    return this.http.post<LeadClosingRequest>(`/api/leads/${leadId}/closing/draft`, data);
  }

  submitForVerification(leadId: number, data: LeadClosingRequest): Observable<LeadClosingRequest> {
    return this.http.post<LeadClosingRequest>(`/api/leads/${leadId}/closing/submit`, data);
  }

  uploadDocument(leadId: number, file: File, type: string): Observable<{ fileUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<{ fileUrl: string; fileName: string }>(`/api/leads/${leadId}/closing/documents`, formData);
  }

  approveClosing(leadId: number): Observable<LeadClosingRequest> {
    return this.http.post<LeadClosingRequest>(`/api/leads/${leadId}/closing/approve`, {});
  }

  rejectClosing(leadId: number, remarks: string): Observable<LeadClosingRequest> {
    return this.http.post<LeadClosingRequest>(`/api/leads/${leadId}/closing/reject`, { remarks });
  }
}
