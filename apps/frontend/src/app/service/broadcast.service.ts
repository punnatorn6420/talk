import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { IResponse } from '../types/response.model';
import {
  IBroadcast,
  IBroadcastItem,
  ICreateBroadcastRequest,
  IUpdateBroadcastRequest,
} from '../types/broadcast.model';

@Injectable({ providedIn: 'root' })
export class _BroadcastService {
  private readonly http = inject(HttpService);
  private readonly baseUrl = `${environment.endpoint}v1/broadcasts`;

  private buildBroadcastFormData(
    payload: ICreateBroadcastRequest | IUpdateBroadcastRequest,
    files: File[] = [],
  ): FormData {
    const formData = new FormData();

    if ('id' in payload && payload.id != null)
      formData.append('id', String(payload.id));
    if (payload.subject != null) formData.append('subject', payload.subject);
    if (payload.detail != null) formData.append('detail', payload.detail);
    if (payload.status != null) formData.append('status', payload.status);

    if (payload.isPinned != null) {
      formData.append('isPinned', String(payload.isPinned));
    }

    if (payload.startDisplayAt != null) {
      formData.append('startDisplayAt', payload.startDisplayAt);
    }

    if (payload.expireDisplayAt != null) {
      formData.append('expireDisplayAt', payload.expireDisplayAt);
    }

    files.forEach((file) => {
      formData.append('attachments', file, file.name);
    });

    return formData;
  }

  createBroadcast(
    payload: ICreateBroadcastRequest,
    files: File[] = [],
  ): Observable<IResponse<IBroadcastItem>> {
    return this.http.postFormData<FormData, IResponse<IBroadcastItem>>(
      this.baseUrl,
      this.buildBroadcastFormData(payload, files),
      true,
    );
  }

  getBroadcasts(payload?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Observable<IResponse<IBroadcast>> {
    const params = new URLSearchParams();
    params.append('keyword', payload?.keyword ?? '');
    params.append('pageNumber', String(payload?.pageNumber ?? 1));
    params.append('pageSize', String(payload?.pageSize ?? 25));

    return this.http.get<IResponse<IBroadcast>>(
      `${this.baseUrl}?${params.toString()}`,
      true,
    );
  }

  updateBroadcast(
    id: string | number,
    payload: IUpdateBroadcastRequest,
    files: File[] = [],
  ): Observable<IResponse<IBroadcastItem>> {
    return this.http.putFormData<FormData, IResponse<IBroadcastItem>>(
      `${this.baseUrl}/${id}`,
      this.buildBroadcastFormData(payload, files),
      true,
    );
  }

  deleteBroadcast(id: string | number): Observable<IResponse<boolean | null>> {
    return this.http.delete<IResponse<boolean | null>>(
      `${this.baseUrl}/${id}`,
      true,
    );
  }

  getMyBroadcasts(payload?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Observable<IResponse<IBroadcastItem[]>> {
    const params = new URLSearchParams();
    params.append('keyword', payload?.keyword ?? '');
    params.append('pageNumber', String(payload?.pageNumber ?? 1));
    params.append('pageSize', String(payload?.pageSize ?? 10));

    return this.http.get<IResponse<IBroadcastItem[]>>(
      `${this.baseUrl}/my?${params.toString()}`,
      true,
    );
  }

  markBroadcastAsRead(id: string | number): Observable<IResponse<unknown>> {
    return this.http.put<Record<string, never>, IResponse<unknown>>(
      `${this.baseUrl}/${id}/read`,
      {},
      true,
    );
  }
}
