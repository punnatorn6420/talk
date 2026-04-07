export type ThreadStatus = 'NEW' | 'SEEN' | 'ANSWERED';

export interface IThreadActivity {
  id: number;
  action: 'CREATED' | 'SEEN' | 'ANSWERED';
  actor: string;
  at: string;
  note?: string;
}

export interface IMessageThread {
  id: string;
  senderName: string;
  title: string;
  content: string;
  postedAt: string | Date;
  status: 'UNREAD' | 'SEEN' | 'ANSWERED';
  avatarUrl?: string;
}

export interface ICreateThreadPayload {
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  senderJobTitle: string;
  senderDepartment: string;
}
