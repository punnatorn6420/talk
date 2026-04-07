import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IResponse } from '../types/response.model';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { IMail } from '../pages/messages/components/ui/mail';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  IMessageParams,
  IMessageRequest,
  IReplyRequest,
} from '../types/message-thread.model';

@Injectable({ providedIn: 'root' })
export class MessageThreadService {
  private https = inject(HttpService);

  private _mails: IMail[] = [];

  private mails = new BehaviorSubject<IMail[]>(this._mails);

  mails$ = this.mails.asObservable();

  constructor() {
    this.getMessageCriteria({}).subscribe((res) => {
      this.updateMails(res.data || []);
    });
  }

  updateMails(data: IMail[]) {
    this._mails = data;
    this.mails.next(data);
  }

  getMessageCriteria(payload: IMessageParams): Observable<IResponse<IMail[]>> {
    const params = new URLSearchParams();
    params.append('keyword', payload.keyword || '');
    params.append('pageNumber', String(payload.pageNumber || '1'));
    params.append('pageSize', String(payload.pageSize || '10'));
    params.append('searchStartDate', payload.searchStartDate || '');
    params.append('searchEndDate', payload.searchEndDate || '');
    params.append('sortField', payload.sortField || '');
    params.append('ascending', String(payload.ascending || 'true'));

    return this.https.get<IResponse<IMail[]>>(
      `${environment.endpoint}v1/messages?${params.toString()}`,
      true,
    );
  }

  getMessageThreadById(id: string): Observable<IResponse<IMail>> {
    return this.https.get<IResponse<IMail>>(
      `${environment.endpoint}v1/messages/${id}`,
      true,
    );
  }

  postMessageThread(payload: IMessageRequest) {
    return this.https.post(`${environment.endpoint}v1/messages`, payload, true);
  }

  putMessageThread(id: string, payload: IMessageRequest) {
    return this.https.put(
      `${environment.endpoint}v1/messages/${id}`,
      payload,
      true,
    );
  }

  deleteMessageThread(id: string) {
    return this.https.delete(`${environment.endpoint}v1/messages/${id}`, true);
  }

  putReplyMessageThread(id: string, payload: IReplyRequest) {
    return this.https.put(
      `${environment.endpoint}v1/messages/${id}/reply`,
      payload,
      true,
    );
  }

  putReadMessageThread(id: string) {
    return this.https.put(
      `${environment.endpoint}v1/messages/${id}/read`,
      {},
      true,
    );
  }
}
