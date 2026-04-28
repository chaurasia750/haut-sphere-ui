import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timeout, catchError, take } from 'rxjs';
import { RemoteConfig, RemoteMetadata, RemoteLoadState, RemoteError } from '@shared';
import { ErrorHandlerService } from '@shared';
import { LoggingService } from '@shared';

interface RemoteMetadataMap {
  [key: string]: RemoteMetadata;
}

/**
 * Remote Loader Service
 * Manages dynamic loading and unloading of remote applications
 * Handles Module Federation runtime loading with error management
 */
@Injectable({
  providedIn: 'root'
})
export class RemoteLoaderService {
  private remoteMetadataMap$ = new BehaviorSubject<RemoteMetadataMap>({});
  private currentRemote$ = new BehaviorSubject<string | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  // Event subjects for component integration
  public remoteLoading$ = new Subject<string>();
  public remoteLoaded$ = new Subject<string>();
  public remoteError$ = new Subject<{ remoteKey: string; error: RemoteError }>();
  public remoteUnloaded$ = new Subject<string>();

  constructor(
    private ngZone: NgZone,
    private errorHandler: ErrorHandlerService,
    private logger: LoggingService
  ) {
    this.logger.info('RemoteLoaderService initialized');
  }

  /**
   * Load a remote application dynamically
   * @param config Remote configuration
   * @returns Promise with loaded module
   */
  async load(config: RemoteConfig): Promise<any> {
    this.remoteLoading$.next(config.key);
    this.isLoading$.next(true);

    const now = Date.now();
    const metadata: RemoteMetadata = {
      key: config.key,
      state: 'loading',
      loadStartTime: now,
      bundleSize: 0
    };

    try {
      this.updateMetadata(config.key, metadata);
      this.logger.info(`Loading remote: ${config.key} from ${config.entry}`);

      // Load remote using dynamic import and Module Federation
      const module = await this.loadRemoteModule(config);

      const endTime = Date.now();
      metadata.state = 'loaded';
      metadata.loadEndTime = endTime;
      metadata.loadDuration = endTime - now;
      this.updateMetadata(config.key, metadata);

      this.currentRemote$.next(config.key);
      this.remoteLoaded$.next(config.key);
      this.isLoading$.next(false);

      this.logger.info(`Remote loaded successfully: ${config.key}`);
      return module;
    } catch (error) {
      const remoteError = this.handleLoadError(error, config);
      metadata.state = 'error';
      metadata.error = remoteError.suggestedAction;
      metadata.loadEndTime = Date.now();
      metadata.loadDuration = (metadata.loadEndTime || Date.now()) - (metadata.loadStartTime || Date.now());
      this.updateMetadata(config.key, metadata);

      this.remoteError$.next({ remoteKey: config.key, error: remoteError });
      this.isLoading$.next(false);

      throw error;
    }
  }

  /**
   * Load remote module with timeout protection
   * @param config Remote configuration
   * @returns Module promise
   */
  private loadRemoteModule(config: RemoteConfig): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Use dynamic import to fetch and load remote
        const remoteScript = await this.fetchRemoteEntry(config.entry);
        
        // Create and initialize container
        const container = await this.initializeContainer(config, remoteScript);

        // Ensure webpack share scope is initialized (for ESM/advanced MF runtimes)
        try {
          if (typeof (window as any).__webpack_init_sharing__ === 'function') {
            // init sharing with default scope
            await (window as any).__webpack_init_sharing__('default');
          }
        } catch (e) {
          // ignore if not available
        }

        // Initialize container sharing with current share scope if supported
        if (container && typeof container.init === 'function') {
          try {
            await container.init((window as any).__webpack_share_scope__ || {});
          } catch (e) {
            // sometimes init can throw if already initialized; ignore
          }
        }

        // Get the exposed module factory and execute it
        const getter = await container.get(config.exposedModule);
        const Module = await getter();

        resolve(Module);
      } catch (error) {
        reject(error);
      }
    }).then(m => this.ngZone.run(() => m));
  }

  /**
   * Fetch remote entry file
   * @param entry URL to remoteEntry.js
   * @returns Script content or module
   */
  private async fetchRemoteEntry(entry: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = entry;
      // Use module type for ESM remote entries (.mjs), otherwise classic script
      script.type = entry.endsWith('.mjs') ? 'module' : 'text/javascript';
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to fetch remote entry: ${entry}`));
      document.body.appendChild(script);
    });
  }

  /**
   * Initialize shared scope for module federation
   * @param config Remote configuration
   * @param script Remote entry script
   */
  private initializeContainer(config: RemoteConfig, script: any): Promise<any> {
    return new Promise((resolve) => {
      // Initialize webpack share scope
      if (!(window as any).__webpack_share_scope__) {
        (window as any).__webpack_share_scope__ = {};
      }

      const globalObj: any = typeof globalThis === 'object' ? globalThis : window;

      const keysToCheck = [
        config.key,
        `__FEDERATION_${config.key}:custom__`,
        // legacy: check module name on window/globalThis
        `${config.key}`
      ];

      const intervalMs = 20;
      const timeoutMs = config.loadTimeout || 15000;
      const start = Date.now();

      const check = () => {
        for (const k of keysToCheck) {
          if (globalObj[k]) {
            return resolve(globalObj[k]);
          }
        }

        // Some runtimes register under globalThis.__MF or other indirections
        // Try common fallback: module-federation SDK may attach container under
        // a module export; if script has dataset or exports we already loaded, try nothing else here.

        if (Date.now() - start > timeoutMs) {
          return resolve(undefined);
        }

        setTimeout(check, intervalMs);
      };

      // Start checking
      check();
    });
  }

  /**
   * Unload a remote application
   * @param remoteKey Remote identifier
   */
  async unload(remoteKey: string): Promise<void> {
    try {
      const metadata = this.remoteMetadataMap$.value[remoteKey];
      if (metadata) {
        metadata.state = 'unloaded';
        this.updateMetadata(remoteKey, metadata);
      }

      // Clean up from window
      if (window[remoteKey]) {
        delete window[remoteKey];
      }

      // Remove scripts associated with remote
      const scripts = document.querySelectorAll(`script[src*="${remoteKey}"]`);
      scripts.forEach(s => s.remove());

      this.remoteUnloaded$.next(remoteKey);
      this.logger.info(`Remote unloaded: ${remoteKey}`);
    } catch (error) {
      this.logger.error(`Error unloading remote ${remoteKey}:`, error);
    }
  }

  /**
   * Handle remote loading errors
   * @param error Error object
   * @param config Remote configuration
   * @returns RemoteError
   */
  private handleLoadError(error: any, config: RemoteConfig): RemoteError {
    let errorType: 'network' | 'timeout' | 'version_conflict' | 'runtime_error' = 'runtime_error';
    let recoverable = false;
    let suggestedAction = 'Try again later';

    if (error.message?.includes('Failed to fetch')) {
      errorType = 'network';
      recoverable = true;
      suggestedAction = 'Check network connection and try again';
    } else if (error.message?.includes('timeout')) {
      errorType = 'timeout';
      recoverable = true;
      suggestedAction = 'The remote took too long to load, try again';
    } else if (error.message?.includes('version')) {
      errorType = 'version_conflict';
      recoverable = false;
      suggestedAction = 'Contact administrator, version mismatch detected';
    }

    const remoteError: RemoteError = {
      type: errorType,
      remoteKey: config.key,
      originalError: error,
      recoverable,
      suggestedAction,
      timestamp: Date.now(),
      context: {
        remoteEntry: config.entry,
        exposedModule: config.exposedModule
      }
    };

    this.errorHandler.handle(remoteError);
    this.logger.error(`Remote load error [${errorType}]: ${config.key}`, remoteError);

    return remoteError;
  }

  /**
   * Get metadata for a specific remote
   * @param remoteKey Remote identifier
   * @returns Remote metadata
   */
  getMetadata(remoteKey: string): RemoteMetadata | undefined {
    return this.remoteMetadataMap$.value[remoteKey];
  }

  /**
   * Get all metadata as Observable
   * @returns Observable of metadata map
   */
  getMetadata$(): Observable<RemoteMetadataMap> {
    return this.remoteMetadataMap$.asObservable();
  }

  /**
   * Check if remote is loaded
   * @param remoteKey Remote identifier
   * @returns Boolean
   */
  isRemoteLoaded(remoteKey: string): boolean {
    const metadata = this.getMetadata(remoteKey);
    return metadata?.state === 'loaded';
  }

  /**
   * Get current remote being displayed
   * @returns Observable of current remote key
   */
  getCurrentRemote$(): Observable<string | null> {
    return this.currentRemote$.asObservable();
  }

  /**
   * Get global loading state
   * @returns Observable of loading state
   */
  getIsLoading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Preload a remote in the background
   * @param config Remote configuration
   */
  async preload(config: RemoteConfig): Promise<void> {
    try {
      this.logger.info(`Preloading remote: ${config.key}`);
      await this.load(config);
    } catch (error) {
      this.logger.warn(`Preload failed for ${config.key}:`, error);
    }
  }

  /**
   * Update metadata for a remote
   * @param remoteKey Remote identifier
   * @param metadata Updated metadata
   */
  private updateMetadata(remoteKey: string, metadata: RemoteMetadata): void {
    const current = this.remoteMetadataMap$.value;
    const updated = { ...current, [remoteKey]: metadata };
    this.remoteMetadataMap$.next(updated);
  }
}

// Declare webpack scope
declare global {
  var __webpack_share_scope__: any;
  var __webpack_init_sharing__: any;
  interface Window {
    [key: string]: any;
    __webpack_share_scope__: any;
    __webpack_init_sharing__: any;
  }
}
