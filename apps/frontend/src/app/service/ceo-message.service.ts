import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  ICeoMessage,
  ICreateMessagePayload,
  IMessageHistory,
  MessageStatus,
} from '../types/ceo-message.model';

@Injectable({ providedIn: 'root' })
export class CeoMessageService {
  private readonly seedMessages: ICeoMessage[] = [
    {
      id: 1001,
      postedAt: '2026-03-30T08:40:00Z',
      subject: 'ขออนุมัติโปรเจ็คปรับปรุงระบบ CRM',
      detail:
        'ทีมขายต้องการเพิ่ม automation flow สำหรับ lead scoring และติดตาม conversion ให้แม่นยำขึ้น ขออนุมัติงบประมาณ 450,000 บาทครับ',
      senderId: 'u-100',
      senderName: 'Narin P.',
      senderJobTitle: 'Sales Manager',
      senderDepartment: 'Sales',
      status: 'REPLIED',
      readAt: '2026-03-30T10:20:00Z',
      repliedAt: '2026-03-30T11:05:00Z',
      ceoReply:
        'อนุมัติในหลักการครับ ให้สรุป scope และ ROI อีกครั้งก่อนเริ่ม implement ภายในสัปดาห์นี้',
      history: [
        {
          id: 1,
          action: 'POSTED',
          actorName: 'Narin P.',
          actionAt: '2026-03-30T08:40:00Z',
        },
        {
          id: 2,
          action: 'READ',
          actorName: 'CEO Office',
          actionAt: '2026-03-30T10:20:00Z',
        },
        {
          id: 3,
          action: 'REPLIED',
          actorName: 'CEO',
          actionAt: '2026-03-30T11:05:00Z',
          note: 'ขอเอกสาร ROI เพิ่มเติม',
        },
      ],
    },
    {
      id: 1002,
      postedAt: '2026-04-01T04:10:00Z',
      subject: 'แจ้งปัญหาคอขวดในขั้นตอนเบิกจ่าย',
      detail:
        'ขั้นตอนอนุมัติ PO ใช้เวลานานเกิน 6 วันทำการ ส่งผลกระทบกับการ onboard vendor ใหม่ อยากเสนอให้ลดระดับการอนุมัติลงหนึ่งชั้น',
      senderId: 'u-101',
      senderName: 'Mali S.',
      senderJobTitle: 'Finance Analyst',
      senderDepartment: 'Finance',
      status: 'READ',
      readAt: '2026-04-01T07:20:00Z',
      history: [
        {
          id: 4,
          action: 'POSTED',
          actorName: 'Mali S.',
          actionAt: '2026-04-01T04:10:00Z',
        },
        {
          id: 5,
          action: 'READ',
          actorName: 'CEO Office',
          actionAt: '2026-04-01T07:20:00Z',
        },
      ],
    },
    {
      id: 1003,
      postedAt: '2026-04-02T13:55:00Z',
      subject: 'เสนอแผนกิจกรรม Townhall Q2',
      detail:
        'ขอ slot เวลา 45 นาที ใน Townhall สำหรับ update กลยุทธ์งาน product roadmap และ Q&A จากพนักงานทุกฝ่าย',
      senderId: 'u-102',
      senderName: 'Korn T.',
      senderJobTitle: 'Product Owner',
      senderDepartment: 'Product',
      status: 'SENT',
      history: [
        {
          id: 6,
          action: 'POSTED',
          actorName: 'Korn T.',
          actionAt: '2026-04-02T13:55:00Z',
        },
      ],
    },
  ];

  private readonly messagesSubject = new BehaviorSubject<ICeoMessage[]>(
    this.seedMessages,
  );

  getMessages(): Observable<ICeoMessage[]> {
    return this.messagesSubject.asObservable().pipe(delay(200));
  }

  createMessage(payload: ICreateMessagePayload): Observable<ICeoMessage> {
    const now = new Date().toISOString();
    const nextId = this.messagesSubject.value.reduce(
      (max, message) => Math.max(max, message.id),
      1000,
    );

    const postedHistory: IMessageHistory = {
      id: Date.now(),
      action: 'POSTED',
      actorName: payload.senderName,
      actionAt: now,
    };

    const newMessage: ICeoMessage = {
      id: nextId + 1,
      postedAt: now,
      subject: payload.subject,
      detail: payload.detail,
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderJobTitle: payload.senderJobTitle,
      senderDepartment: payload.senderDepartment,
      status: 'SENT',
      history: [postedHistory],
    };

    this.messagesSubject.next([newMessage, ...this.messagesSubject.value]);

    return of(newMessage).pipe(delay(150));
  }

  getStatusCount(status: MessageStatus): number {
    return this.messagesSubject.value.filter((message) => message.status === status)
      .length;
  }
}
