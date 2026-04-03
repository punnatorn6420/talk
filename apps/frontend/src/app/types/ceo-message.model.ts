export type MessageStatus = 'SENT' | 'READ' | 'REPLIED';

export interface IMessageHistory {
  id: number;
  action: 'POSTED' | 'READ' | 'REPLIED';
  actorName: string;
  actionAt: string;
  note?: string;
}

export interface ICeoMessage {
  id: number;
  postedAt: string;
  subject: string;
  detail: string;
  ceoReply?: string;
  senderName: string;
  status: MessageStatus;
  readAt?: string;
  repliedAt?: string;
  history: IMessageHistory[];
}

export interface ICreateMessagePayload {
  subject: string;
  detail: string;
  senderName: string;
}
