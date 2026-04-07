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
