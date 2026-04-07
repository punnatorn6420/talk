import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mail } from '../mail';

const DEFAULT_MOCK_MAILS: Mail[] = [
  {
    id: 1000,
    from: 'Ioni Bowcher',
    email: 'ionibowcher@gmail.com',
    image: 'ionibowcher.png',
    title: 'Apply These 7 Secret Techniques To Improve Event  Apply These',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: 'May 30 2022',
    important: true,
    starred: false,
    trash: false,
    spam: false,
    archived: false,
  },
  {
    id: 1001,
    from: 'Amy Elsner',
    email: 'amyelsner@gmail.com',
    image: 'amyelsner.png',
    title: 'Nullam purus metus, cras adipiscing magna et, aliquam gravida',
    message:
      'Iaculis nunc sed augue lacus viverra vitae. Amet porttitor eget dolor morbi non arcu.',
    date: 'May 30 2022',
    important: false,
    starred: false,
    trash: true,
    spam: false,
    archived: false,
  },
  {
    id: 1002,
    from: 'Asiya Javayant',
    email: 'asiyajavayant@gmail.com',
    image: 'asiyajavayant.png',
    title: 'Consectetur sed dis viverra lorem. Augue felis sed elit rhoncus non',
    message:
      'In tellus integer feugiat scelerisque varius. Auctor neque vitae tempus quam pellentesque nec nam aliquam.',
    date: 'May 28 2022',
    important: false,
    starred: false,
    trash: false,
    spam: true,
    archived: false,
  },
  {
    id: 1003,
    from: 'Xuxue Feng',
    email: 'xuexuefeng@gmail.com',
    image: 'xuxuefeng.png',
    title: 'Eget ipsum quam eu a, sit pellentesque molestie tristique.',
    message:
      'Euismod lacinia at quis risus. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique.',
    date: 'May 28 2022',
    important: false,
    starred: true,
    trash: false,
    spam: false,
    archived: false,
  },
  {
    id: 1004,
    from: 'Ivan Magalhaes',
    email: 'ionibowcher@gmail.com',
    image: 'ivanmagalhaes.png',
    title: 'Tincidunt sed vel, ipsum in tincidunt. Scelerisque lectus dolor cras',
    message:
      'Cursus mattis molestie a iaculis at erat. Nisi quis eleifend quam adipiscing vitae proin sagittis.',
    date: 'May 27 2022',
    important: false,
    starred: false,
    trash: true,
    spam: false,
    archived: false,
  },
];

@Injectable()
export class MailService {
  private _mails: Mail[] = [...DEFAULT_MOCK_MAILS];

  private mails = new BehaviorSubject<Mail[]>(this._mails);

  mails$ = this.mails.asObservable();

  updateMails(data: Mail[]) {
    this._mails = data;
    this.mails.next(data);
  }

  onStar(id: number) {
    this._mails = this._mails.map((m) =>
      m.id === id ? { ...m, starred: !m.starred } : m,
    );
    this.mails.next(this._mails);
  }

  onArchive(id: number) {
    this._mails = this._mails.map((m) =>
      m.id === id ? { ...m, archived: !m.archived } : m,
    );
    this.mails.next(this._mails);
  }

  onBookmark(id: number) {
    this._mails = this._mails.map((m) =>
      m.id === id ? { ...m, important: !m.important } : m,
    );
    this.mails.next(this._mails);
  }

  onDelete(id: number) {
    this._mails = this._mails.filter((m) => m.id !== id);
    this.mails.next(this._mails);
  }

  onDeleteMultiple(mails: Mail[]) {
    const idArray = mails.map((m) => Number(m.id));
    this._mails = this._mails.filter((m) => idArray.indexOf(m.id) == -1);
    this.mails.next(this._mails);
  }

  onArchiveMultiple(mails: Mail[]) {
    const idArray = mails.map((m) => m.id);

    for (let i = 0; i < this._mails.length; i++) {
      const mail = this._mails[i];

      if (idArray.indexOf(mail.id) !== -1) {
        mail.archived = true;
        this._mails[i] = mail;
      }
    }

    this.mails.next(this._mails);
  }

  onSpamMultiple(mails: Mail[]) {
    const idArray = mails.map((m) => m.id);

    for (let i = 0; i < this._mails.length; i++) {
      let mail = this._mails[i];

      if (idArray.indexOf(mail.id) !== -1) {
        mail = {
          ...mail,
          spam: true,
          important: false,
          starred: false,
          archived: false,
        };
        this._mails[i] = mail;
      }
    }

    this.mails.next(this._mails);
  }

  onTrash(id: number) {
    this._mails = this._mails.map((m) =>
      m.id === id ? { ...m, trash: true } : m,
    );
    this.mails.next(this._mails);
  }

  onSend(mail: Mail) {
    if (!mail.id) {
      mail.id = this.generateId();
    }
    if (!mail.title) {
      mail.title = 'Untitled';
    }

    mail.date = this.generateDate();
    this._mails.push(mail);
    this.mails.next(this._mails);
  }

  generateId() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  generateDate() {
    return new Date().toDateString().split(' ').slice(1, 4).join(' ');
  }
}
