export type BroadcastStatus = 'Draft' | 'Sent';

export interface IBroadcast {
  items: IBroadcastItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface IBroadcastItem {
  id: number;
  subject: string;
  detail: string;
  status: BroadcastStatus;
  isPinned?: boolean;
  startDisplayAt?: string | null;
  expireDisplayAt?: string | null;
  isRead?: boolean;
  readCount?: number;
  createdAt?: string | null;
  createdBy?: string | null;
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
