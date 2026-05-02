export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: User;
}
