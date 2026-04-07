export enum IUserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface IUserInfo {
  id: number;
  objectId: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  active: boolean;
  roles: IUserRole[];
  team: string;
  createdAt: string;
  modifiedAt: string;
}
