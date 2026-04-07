import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IResponse } from '../types/response.model';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MessageThreadService {
  private http = inject(HttpService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  getMessageCriteria(payload: any): Observable<IResponse<any>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<IResponse<any>>(
      `${environment.endpoint}v1/messages`,
      true,
    );
  }
}
