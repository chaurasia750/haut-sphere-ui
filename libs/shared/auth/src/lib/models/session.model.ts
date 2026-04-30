/**
 * Active user session state
 */

import { ValidRoleId } from './role.enum';

export interface Session {
  userId: string;
  roleId: ValidRoleId;
  isAuthenticated: boolean;
  expiresAt: number; // Unix timestamp
  lastActivity: number; // Unix timestamp
}
