/**
 * Authentication response from backend login endpoint
 * Tokens are stored in httpOnly cookies by backend; frontend receives metadata only
 */

import { ValidRoleId } from './role.enum';

export interface AuthResponse {
  roleId: ValidRoleId;
  userId: string;
  expiresIn: number; // seconds until access token expires
}
