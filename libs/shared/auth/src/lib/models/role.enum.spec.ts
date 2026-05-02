import { describe, it, expect } from 'vitest';
import { RoleId, isValidRole, roleRouteMap } from './role.enum';

describe('RoleId Enum', () => {
  it('should have valid role IDs', () => {
    expect(RoleId.SYSTEM_ADMIN).toBe(1);
    expect(RoleId.ADMIN).toBe(2);
    expect(RoleId.MEMBER).toBe(3);
    expect(RoleId.MANAGER).toBe(4);
  });

  it('should validate correct role IDs', () => {
    expect(isValidRole(1)).toBe(true);
    expect(isValidRole(2)).toBe(true);
    expect(isValidRole(3)).toBe(true);
    expect(isValidRole(4)).toBe(true);
  });

  it('should reject invalid role IDs', () => {
    expect(isValidRole(0)).toBe(false);
    expect(isValidRole(5)).toBe(false);
    expect(isValidRole(-1)).toBe(false);
    expect(isValidRole('1')).toBe(false);
    expect(isValidRole(null)).toBe(false);
    expect(isValidRole(undefined)).toBe(false);
  });

  it('should map roles to correct routes', () => {
    expect(roleRouteMap[RoleId.SYSTEM_ADMIN]).toBe('/admin');
    expect(roleRouteMap[RoleId.ADMIN]).toBe('/admin');
    expect(roleRouteMap[RoleId.MEMBER]).toBe('/member');
    expect(roleRouteMap[RoleId.MANAGER]).toBe('/management');
  });
});
