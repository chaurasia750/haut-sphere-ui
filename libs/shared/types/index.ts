/**
 * Shared Types for Module Federation Architecture
 * These types are used across all remotes and the Shell
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  authMethod?: 'bearer' | 'session' | 'custom';
}

// ============================================================================
// Remote Configuration Types
// ============================================================================

export type RemoteLoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'unloaded';
export type RemoteUIState = 'hidden' | 'loading' | 'visible' | 'error' | 'unauthorized';

export interface RemoteConfig {
  key: string;
  entry: string;
  exposedModule: string;
  route: string;
  displayName: string;
  preload?: boolean;
  loadTimeout?: number;
  metadata?: Record<string, any>;
}

export interface RemoteMetadata {
  key: string;
  state: RemoteLoadState;
  component?: any;
  error?: string;
  loadStartTime?: number;
  loadEndTime?: number;
  loadDuration?: number;
  bundleSize?: number;
}

export interface RemoteLoadRequest {
  remoteKey: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
  authContext?: AuthState;
  timeout?: number;
  onSuccess?: (component: any) => void;
  onError?: (error: RemoteError) => void;
}

// ============================================================================
// Error Types
// ============================================================================

export type RemoteErrorType =
  | 'network'
  | 'bundle_mismatch'
  | 'timeout'
  | 'auth_error'
  | 'version_conflict'
  | 'runtime_error'
  | 'unknown';

export interface RemoteError {
  type: RemoteErrorType;
  remoteKey: string;
  originalError?: Error;
  recoverable: boolean;
  suggestedAction?: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  meta?: {
    timestamp: number;
    requestId: string;
  };
}

// ============================================================================
// Pagination & Filtering
// ============================================================================

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface Filter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// Service Interfaces
// ============================================================================

export interface IAuthService {
  getAuthState(): Observable<AuthState>;
  hasRole(role: string): boolean;
  hasPermission(permission: string): boolean;
  getCurrentUser(): User | undefined;
  getToken(): string | undefined;
  logout(): Observable<void>;
}

export interface IErrorHandler {
  handle(error: RemoteError): void;
  showError(message: string, severity?: 'error' | 'warning' | 'info'): void;
  errors$(): Observable<RemoteError>;
}

export interface IRemoteLoader {
  load(config: RemoteConfig): Promise<any>;
  unload(remoteKey: string): Promise<void>;
  getMetadata(remoteKey: string): RemoteMetadata | undefined;
}

// For Observable imports (add to your Angular imports)
import { Observable } from 'rxjs';
