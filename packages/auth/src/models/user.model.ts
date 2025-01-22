export interface IUser {
  user_id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}
