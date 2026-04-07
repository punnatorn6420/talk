// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { delay } from 'rxjs/operators';
// import {
//   ICreateThreadPayload,
//   IMessageThread,
//   IThreadActivity,
// } from '../types/message-thread.model';

// @Injectable({ providedIn: 'root' })
// export class MessageThreadService {
//   private readonly seedThreads: IMessageThread[] = [
//     {
//       id: 1001,
//       postedAt: '2026-03-30T08:40:00Z',
//       title: 'ขออนุมัติโปรเจ็คปรับปรุงระบบ CRM',
//       content:
//         'ทีมขายต้องการเพิ่ม automation flow สำหรับ lead scoring และติดตาม conversion ให้แม่นยำขึ้น ขออนุมัติงบประมาณ 450,000 บาทครับ',
//       senderId: '93834fe2-c75b-4276-a7d7-6a1d9ba2e29c',
//       senderName: 'Punnatorn Yimpong',
//       senderJobTitle: 'Front-End Development',
//       senderDepartment: 'HQ',
//       status: 'ANSWERED',
//       seenAt: '2026-03-30T10:20:00Z',
//       answeredAt: '2026-03-30T11:05:00Z',
//       response:
//         'อนุมัติในหลักการครับ ให้สรุป scope และ ROI อีกครั้งก่อนเริ่ม implement ภายในสัปดาห์นี้',
//       activities: [
//         {
//           id: 1,
//           action: 'CREATED',
//           actor: 'Punnatorn Yimpong',
//           at: '2026-03-30T08:40:00Z',
//         },
//         { id: 2, action: 'SEEN', actor: 'Admin', at: '2026-03-30T10:20:00Z' },
//         {
//           id: 3,
//           action: 'ANSWERED',
//           actor: 'Admin',
//           at: '2026-03-30T11:05:00Z',
//         },
//       ],
//     },
//     {
//       id: 1002,
//       postedAt: '2026-04-01T04:10:00Z',
//       title: 'แจ้งปัญหาคอขวดในขั้นตอนเบิกจ่าย',
//       content:
//         'ขั้นตอนอนุมัติ PO ใช้เวลานานเกิน 6 วันทำการ ส่งผลกระทบกับการ onboard vendor ใหม่ อยากเสนอให้ลดระดับการอนุมัติลงหนึ่งชั้น',
//       senderId: 'f1da245f-c2d4-434f-9d8c-9ddf0b6c1100',
//       senderName: 'Mali S.',
//       senderJobTitle: 'Finance Analyst',
//       senderDepartment: 'Finance',
//       status: 'SEEN',
//       seenAt: '2026-04-01T07:20:00Z',
//       activities: [
//         {
//           id: 4,
//           action: 'CREATED',
//           actor: 'Mali S.',
//           at: '2026-04-01T04:10:00Z',
//         },
//         { id: 5, action: 'SEEN', actor: 'Admin', at: '2026-04-01T07:20:00Z' },
//       ],
//     },
//   ];

//   private readonly threadsSubject = new BehaviorSubject<IMessageThread[]>(
//     this.seedThreads,
//   );

//   getThreads(): Observable<IMessageThread[]> {
//     return this.threadsSubject.asObservable().pipe(delay(150));
//   }

//   createThread(payload: ICreateThreadPayload): Observable<IMessageThread> {
//     const now = new Date().toISOString();
//     const nextId = this.threadsSubject.value.reduce(
//       (max, thread) => Math.max(max, thread.id),
//       1000,
//     );

//     const createdActivity: IThreadActivity = {
//       id: Date.now(),
//       action: 'CREATED',
//       actor: payload.senderName,
//       at: now,
//     };

//     const newThread: IMessageThread = {
//       id: nextId + 1,
//       postedAt: now,
//       title: payload.title,
//       content: payload.content,
//       senderId: payload.senderId,
//       senderName: payload.senderName,
//       senderJobTitle: payload.senderJobTitle,
//       senderDepartment: payload.senderDepartment,
//       status: 'NEW',
//       activities: [createdActivity],
//     };

//     this.threadsSubject.next([newThread, ...this.threadsSubject.value]);
//     return of(newThread).pipe(delay(120));
//   }

//   replyThread(
//     threadId: number,
//     response: string,
//   ): Observable<IMessageThread | null> {
//     const now = new Date().toISOString();
//     const updated = this.threadsSubject.value.map((thread) => {
//       if (thread.id !== threadId) {
//         return thread;
//       }

//       return {
//         ...thread,
//         status: 'ANSWERED' as const,
//         answeredAt: now,
//         response,
//         activities: [
//           ...thread.activities,
//           {
//             id: Date.now(),
//             action: 'ANSWERED',
//             actor: 'Admin',
//             at: now,
//           } as IThreadActivity,
//         ],
//       };
//     });

//     this.threadsSubject.next(updated);
//     const thread = updated.find((item) => item.id === threadId) ?? null;
//     return of(thread).pipe(delay(120));
//   }
// }
