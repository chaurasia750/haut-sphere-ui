/**
 * Shared Library - Public API
 * 
 * This barrel export makes it easy for remotes and Shell to import:
 * import { AuthService, ErrorHandlerService, LoggingService } from '@shared';
 */

// Re-export types
export * from './types';

// Re-export Auth services and guards
export { AuthService } from './auth/services/auth.service';
export { AuthGuard, RoleGuard, PermissionGuard, authGuard, roleGuard, permissionGuard } from './auth/guards/auth.guards';
export { AuthHttpInterceptor } from './auth/interceptors/auth-http.interceptor';

// Re-export Error handling
export { ErrorHandlerService } from './errors/error-handler.service';

// Re-export Logging
export { LoggingService } from './logging/logging.service';

// Re-export shared UI layout module/components
export * from './ui/src';

// Re-export shared i18n service
export * from './i18n';
