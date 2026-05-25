export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  FORWARDER = 'forwarder',
}
type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  iat: number;
};

export interface IAuthenticate {
  token: string;
  user: User;
}
