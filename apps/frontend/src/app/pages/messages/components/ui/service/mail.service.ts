import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMail } from '../mail';
@Injectable()
export class MailService {
  private _mails: IMail[] = [];

  private mails = new BehaviorSubject<IMail[]>(this._mails);

  mails$ = this.mails.asObservable();

  updateMails(data: IMail[]) {
    this._mails = data;
    this.mails.next(data);
  }

  onDelete(id: number) {
    this._mails = this._mails.filter((m) => m.id !== id);
    this.mails.next(this._mails);
  }

  onTrash(id: number) {
    this._mails = this._mails.map((m) =>
      m.id === id ? { ...m, trash: true } : m,
    );
    this.mails.next(this._mails);
  }

  onSend(mail: IMail) {
    if (!mail.subject) {
      mail.subject = 'Untitled';
    }

    this._mails.push(mail);
    this.mails.next(this._mails);
  }
}
