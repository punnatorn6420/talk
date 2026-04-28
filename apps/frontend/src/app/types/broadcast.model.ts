export type BroadcastStatus = 'Draft' | 'Sent';

export interface IBroadcastAttachment {
  id: number;
  fileName: string;
}

export interface IBroadcast {
  totalCount: number;
  items: IBroadcastItem[];
}

export interface IBroadcastItem {
  readCount: number;
  id: number;
  subject: string;
  detail: string;
  status: BroadcastStatus;
  isPinned?: boolean;
  isRead?: boolean;

  startDisplayDate?: string | null;
  expireDisplayDate?: string | null;

  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;

  attachments?: IBroadcastAttachment[];
}

export interface ICreateBroadcastRequest {
  subject: string;
  detail: string;
  status: BroadcastStatus;
  isPinned?: boolean;
  startDisplayAt?: string | null;
  expireDisplayAt?: string | null;
}

export interface IUpdateBroadcastRequest {
  id?: number;
  subject?: string;
  detail?: string;
  status?: BroadcastStatus;
  isPinned?: boolean;
  startDisplayAt?: string | null;
  expireDisplayAt?: string | null;
}

export interface IBroadcastReader {
  userId: number;
  firstName: string;
  lastName: string;
  email?: string;
  department?: string;
  jobTitle?: string;
  readAt?: string | null;
}

export interface IBroadcastDetail {
  id: number;
  subject: string;
  detail: string;
  status: string;
  isPinned: boolean;
  startDisplayAt: string | null;
  expireDisplayAt: string | null;
  isRead: boolean;
  readCount: number;
  createdAt: string;
  createdBy: string;
  attachments?: IBroadcastAttachment[];
}
