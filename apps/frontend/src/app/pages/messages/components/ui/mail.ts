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
