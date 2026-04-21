import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { IResponse } from '../types/response.model';
import {
  IMail,
  IMailResponse,
  IMessageParams,
  IMessageRequest,
  IReplyRequest,
} from '../types/message.model';

@Injectable({ providedIn: 'root' })
export class _MessageService {
  private readonly http = inject(HttpService);
  private readonly baseUrl = `${environment.endpoint}v1/messages`;

  getMessageCriteria(
    payload: IMessageParams = {},
  ): Observable<IResponse<IMailResponse>> {
    const params = new URLSearchParams();

    params.append('keyword', payload.keyword ?? '');
    params.append('pageNumber', String(payload.pageNumber ?? 1));
    params.append('pageSize', String(payload.pageSize ?? 10));
    params.append('searchStartDate', payload.searchStartDate ?? '');
    params.append('searchEndDate', payload.searchEndDate ?? '');
    params.append('sortField', payload.sortField ?? '');
    params.append('ascending', String(payload.ascending ?? true));

    return this.http.get<IResponse<IMailResponse>>(
      `${this.baseUrl}?${params.toString()}`,
      true,
    );
  }

  getMessageThreadById(id: string | number): Observable<IResponse<IMail>> {
    return this.http.get<IResponse<IMail>>(`${this.baseUrl}/${id}`, true);
  }

  postMessageThread(payload: IMessageRequest): Observable<IResponse<IMail>> {
    return this.http.post<IMessageRequest, IResponse<IMail>>(
      this.baseUrl,
      payload,
      true,
    );
  }

  postMessageThreadWithFiles(formData: FormData) {
    return this.http.postFormData<FormData, IResponse<IMail>>(
      this.baseUrl,
      formData,
      true,
    );
  }

  putMessageThread(
    id: string | number,
    payload: IMessageRequest,
  ): Observable<IResponse<IMail>> {
    return this.http.put<IMessageRequest, IResponse<IMail>>(
      `${this.baseUrl}/${id}/update`,
      payload,
      true,
    );
  }

  putMessageThreadWithFiles(id: string, formData: FormData) {
    return this.http.putFormData<FormData, IResponse<IMail>>(
      `${this.baseUrl}/${id}/update`,
      formData,
      true,
    );
  }

  deleteMessageThread(
    id: string | number,
  ): Observable<IResponse<boolean | null>> {
    return this.http.delete<IResponse<boolean | null>>(
      `${this.baseUrl}/${id}`,
      true,
    );
  }

  putReplyMessageThread(
    id: string | number,
    payload: IReplyRequest,
  ): Observable<IResponse<IMail>> {
    return this.http.put<IReplyRequest, IResponse<IMail>>(
      `${this.baseUrl}/${id}/reply`,
      payload,
      true,
    );
  }

  putReadMessageThread(id: string | number): Observable<IResponse<IMail>> {
    return this.http.put<Record<string, never>, IResponse<IMail>>(
      `${this.baseUrl}/${id}/read`,
      {},
      true,
    );
  }

  putReplyMessageThreadWithFiles(id: string, formData: FormData) {
    return this.http.putFormData<FormData, IResponse<IMail>>(
      `${this.baseUrl}/${id}/reply`,
      formData,
      true,
    );
  }

  downloadMessageAttachment(
    messageId: string | number,
    attachmentId: string | number,
  ): Observable<Blob> {
    return this.http.getBlob(
      `${this.baseUrl}/${messageId}/attachments/${attachmentId}`,
      true,
    );
  }

  deleteMessageAttachment(
    messageId: string | number,
    attachmentId: string | number,
  ) {
    return this.http.delete(
      `${this.baseUrl}/${messageId}/attachments/${attachmentId}`,
      true,
    );
  }
}
