import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@shared/environments/api.dev';

export interface UploadedFileInfo {
  id: number;
  url: string;
  fileName: string;
  isPrimary: boolean;
}

export interface TempUploadResult {
  tempKey: string;
  files: UploadedFileInfo[];
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = apiConfig.baseUrl;

  tempUpload(files: File[]): Observable<TempUploadResult> {
    const formData = this.buildFormData(files);
    return this.http.post<TempUploadResult>(`${this.baseUrl}/media/temp-upload`, formData);
  }

  tempUploadWithProgress(files: File[]): Observable<HttpEvent<TempUploadResult>> {
    const formData = this.buildFormData(files);
    return this.http.post<TempUploadResult>(`${this.baseUrl}/media/temp-upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  private buildFormData(files: File[]): FormData {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    return formData;
  }

  getFileUrl(id: number): string {
    return `${this.baseUrl}/media/view/${id}`;
  }
}
