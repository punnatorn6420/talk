export type ThreadStatus = 'NEW' | 'SEEN' | 'ANSWERED';

export interface IThreadActivity {
  id: number;
  action: 'CREATED' | 'SEEN' | 'ANSWERED';
  actor: string;
  at: string;
  note?: string;
}

export interface IMessageThread {
  id: number;
  postedAt: string;
  title: string;
  content: string;
  response?: string;
  senderId: string;
  senderName: string;
  senderJobTitle: string;
  senderDepartment: string;
  status: ThreadStatus;
  seenAt?: string;
  answeredAt?: string;
  activities: IThreadActivity[];
}

export interface ICreateThreadPayload {
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  senderJobTitle: string;
  senderDepartment: string;
}
