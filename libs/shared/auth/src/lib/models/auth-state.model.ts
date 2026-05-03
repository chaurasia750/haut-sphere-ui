import { ValidRoleId } from './role.enum';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  roleId: ValidRoleId | null;
  roleName: string | null;
  expiresIn: number;
  status: AuthStatus;
  errorMessage: string | null;
  blocked: boolean;
}
