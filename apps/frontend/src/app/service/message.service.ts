import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IResponse } from '../types/response.model';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of, delay } from 'rxjs';
import { MOCK_MAILS } from './mail.mock';
import {
  IMail,
  IMailResponse,
  IMessageParams,
  IMessageRequest,
  IReplyRequest,
} from '../types/message.model';

@Injectable({ providedIn: 'root' })
export class _MessageService {
  private https = inject(HttpService);

  private _mails: IMail[] = [];

  private mails = new BehaviorSubject<IMail[]>(this._mails);

  mails$ = this.mails.asObservable();

  constructor() {
    this.getMessageCriteria({}).subscribe((res) => {
      console.log(res.data.items);
      this.updateMails(res.data.items || []);
    });
  }

  updateMails(data: IMail[]) {
    this._mails = data;
    this.mails.next(data);
  }

  getMessageCriteria(
    payload: IMessageParams,
  ): Observable<IResponse<IMailResponse>> {
    const keyword = (payload.keyword || '').trim().toLowerCase();
    const pageNumber = payload.pageNumber ?? 1;
    const pageSize = payload.pageSize ?? 10;
    const searchStartDate = payload.searchStartDate || '';
    const searchEndDate = payload.searchEndDate || '';
    const sortField = payload.sortField || '';
    const ascending = payload.ascending ?? true;

    let filteredData = [...MOCK_MAILS];

    // filter by keyword
    if (keyword) {
      filteredData = filteredData.filter((item) =>
        [
          item.subject,
          item.message,
          item.detail,
          item.reply,
          item.email,
          item.jobTitle,
          item.department,
          item.fullName,
          item.status,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(keyword)),
      );
    }

    // filter by date range (using postedAt)
    if (searchStartDate) {
      const start = new Date(searchStartDate).getTime();
      filteredData = filteredData.filter(
        (item) => new Date(item.postedAt).getTime() >= start,
      );
    }

    if (searchEndDate) {
      const end = new Date(searchEndDate).getTime();
      filteredData = filteredData.filter(
        (item) => new Date(item.postedAt).getTime() <= end,
      );
    }

    // sorting
    if (sortField) {
      filteredData.sort((a: IMail, b: IMail) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as Record<string, any>)[sortField];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as Record<string, any>)[sortField];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return ascending ? -1 : 1;
        if (bValue == null) return ascending ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return ascending ? aValue - bValue : bValue - aValue;
        }

        const aText = String(aValue).toLowerCase();
        const bText = String(bValue).toLowerCase();

        return ascending
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      });
    }

    const totalCount = filteredData.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagedItems = filteredData.slice(startIndex, endIndex);

    const response: IResponse<IMailResponse> = {
      correlationId: '',
      status: 'Mock data loaded successfully',
      data: {
        totalCount,
        items: pagedItems,
      },
    };

    return of(response).pipe(delay(300));
  }

  // getMessageCriteria(
  //   payload: IMessageParams,
  // ): Observable<IResponse<IMailResponse>> {
  //   const params = new URLSearchParams();
  //   params.append('keyword', payload.keyword || '');
  //   params.append('pageNumber', String(payload.pageNumber || '1'));
  //   params.append('pageSize', String(payload.pageSize || '10'));
  //   params.append('searchStartDate', payload.searchStartDate || '');
  //   params.append('searchEndDate', payload.searchEndDate || '');
  //   params.append('sortField', payload.sortField || '');
  //   params.append('ascending', String(payload.ascending || 'true'));

  //   return this.https.get<IResponse<IMailResponse>>(
  //     `${environment.endpoint}v1/messages?${params.toString()}`,
  //     true,
  //   );
  // }

  // getMessageThreadById(id: string): Observable<IResponse<IMail>> {
  //   return this.https.get<IResponse<IMail>>(
  //     `${environment.endpoint}v1/messages/${id}`,
  //     true,
  //   );
  // }

  getMessageThreadById(id: string): Observable<IResponse<IMail>> {
    const item = MOCK_MAILS.find((mail) => String(mail.id) === String(id));
    return of({
      correlationId: '',
      status: item ? 'Mock detail loaded successfully' : 'Message not found',
      data: item as IMail,
    }).pipe(delay(300));
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
