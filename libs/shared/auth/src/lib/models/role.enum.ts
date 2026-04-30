/**
 * Role enumeration for role-based access control
 * Defines valid role IDs that determine module routing
 */

export enum RoleId {
  SYSTEM_ADMIN = 1,
  ADMIN = 2,
  MEMBER = 3,
  MANAGER = 4
}

export type ValidRoleId = RoleId.SYSTEM_ADMIN | RoleId.ADMIN | RoleId.MEMBER | RoleId.MANAGER;

/**
 * Validates if a given value is a valid role ID
 * @param role - Value to validate
 * @returns true if role is one of (1, 2, 3, 4)
 */
export function isValidRole(role: unknown): role is ValidRoleId {
  return [1, 2, 3, 4].includes(role as any);
}

/**
 * Maps role ID to module route
 */
export const roleRouteMap: Record<ValidRoleId, string> = {
  [RoleId.SYSTEM_ADMIN]: '/admin',
  [RoleId.ADMIN]: '/admin',
  [RoleId.MEMBER]: '/member',
  [RoleId.MANAGER]: '/management'
};
