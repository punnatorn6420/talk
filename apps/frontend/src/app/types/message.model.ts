export interface IMailResponse {
  totalCount: number;
  items: IMail[];
}

export interface IMail {
  id: number | string;
  subject: string;
  message?: string;
  detail?: string;
  reply: string;
  status: string;
  email?: string;
  jobTitle?: string;
  department?: string;
  fullName?: string;
  postedAt: string;
  repliedAt: string | null;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
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
}

export interface IReplyRequest {
  reply: string;
}
