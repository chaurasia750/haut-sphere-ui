/**
 * Authentication request payload sent to backend login endpoint
 */
export interface AuthRequest {
  userName: string;
  password: string;
  keepMeSignedIn: boolean;
}
