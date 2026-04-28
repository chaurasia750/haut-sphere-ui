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

    const metadata: RemoteMetadata = {
      key: config.key,
      state: 'loading',
      loadTime: new Date().toISOString(),
      bundleSize: 0,
      errors: []
    };

    try {
      this.updateMetadata(config.key, metadata);
      this.logger.info(`Loading remote: ${config.key} from ${config.entry}`);

      // Load remote using dynamic import and Module Federation
      const module = await this.loadRemoteModule(config);

      metadata.state = 'loaded';
      metadata.loadTime = new Date().toISOString();
      this.updateMetadata(config.key, metadata);

      this.currentRemote$.next(config.key);
      this.remoteLoaded$.next(config.key);
      this.isLoading$.next(false);

      this.logger.info(`Remote loaded successfully: ${config.key}`);
      return module;
    } catch (error) {
      const remoteError = this.handleLoadError(error, config);
      metadata.state = 'error';
      metadata.errors = [remoteError];
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
        
        // Factory function for getting the exposed module
        const factory = await window[config.key].init(__webpack_share_scope__);
        const Module = factory.get(config.exposedModule);
        
        resolve(Module ? Module() : Module);
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
      script.type = 'text/javascript';
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
      if (!window.__webpack_share_scope__) {
        window.__webpack_share_scope__ = {};
      }
      
      // Wait for remote to be available
      const checkInterval = setInterval(() => {
        if (window[config.key]) {
          clearInterval(checkInterval);
          resolve(window[config.key]);
        }
      }, 10);

      // Timeout check
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window[config.key]) {
          resolve(window[config.key]);
        }
      }, config.loadTimeout || 5000);
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
      timestamp: new Date().toISOString(),
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
