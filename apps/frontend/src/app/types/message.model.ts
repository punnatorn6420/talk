export interface IMailResponse {
  totalCount: number;
  items: IMail[];
}

export interface IMessageAttachment {
  id: number;
  fileName: string;
}

export interface IMail {
  id: number | string;
  subject?: string | null;
  detail?: string | null;
  message?: string | null;
  reply?: string | null;
  status?: string | null;
  email?: string | null;
  fullName?: string | null;
  postedAt?: string | null;
  repliedAt?: string | null;
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;

  attachments?: IMessageAttachment[];
}

export interface IMessageParams {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
  searchStartDate?: string;
  searchEndDate?: string;
  sortField?: string;
  ascending?: boolean;
}

export interface IMessageRequest {
  subject: string;
  detail: string;
  status: string;
  attachments?: File[];
}

export interface IReplyRequest {
  reply: string;
}
