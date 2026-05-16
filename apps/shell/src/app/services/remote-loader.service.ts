import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RemoteConfig {
  key: string;
  entry: string;
  exposedModule: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteLoaderService {
  private metadataMap$ = new BehaviorSubject<any>({});

  constructor(private ngZone: NgZone) {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling() {
    // Suppress 'ws does not work in the browser' errors from dts-plugin
    const originalError = console.error;
    
    window.addEventListener('error', (event: ErrorEvent) => {
      if (event.message && event.message.includes('ws does not work in the browser')) {
        console.warn('[RemoteLoader] Suppressed ws WebSocket error (expected from module federation DTS plugin)');
        event.preventDefault();
      }
    }, true);

    console.error = function(...args: any[]) {
      const message = args[0]?.toString?.() || String(args[0]);
      if (message && message.includes('ws does not work in the browser')) {
        console.warn('[RemoteLoader] Suppressed ws WebSocket error:', message);
        return;
      }
      originalError.apply(console, args);
    };
  }

  async load(config: RemoteConfig): Promise<any> {
    try {
      if (!config.entry) {
        throw new Error(`Remote entry URL missing for "${config.key}"`);
      }

      console.log(`Loading remote: ${config.key} from ${config.entry}`);

      // Dynamically import the remote entry with ws error suppression
      const mod = await this.loadRemoteModule(config.entry);

      // If the imported object looks like a Module Federation container (has get/init),
      // initialize sharing and resolve the exposed module before returning.
      if (mod && typeof mod.get === 'function') {
        try {
          if (typeof (window as any).__webpack_init_sharing__ === 'function') {
            // initialize host sharing scope
            await (window as any).__webpack_init_sharing__('default');
          }
        } catch (e) {
          console.warn('[RemoteLoader] __webpack_init_sharing__ failed', e);
        }

        try {
          // initialize container with shared scope (if available)
          await mod.init((window as any).__webpack_share_scopes__?.default);
        } catch (e) {
          // ignore init errors - remote may already be initialized
        }

        const exposed = config.exposedModule || './Module';
        try {
          const factory = await mod.get(exposed);
          const remoteExports = factory();

          return remoteExports;
        } catch (e) {
          console.warn(`[RemoteLoader] Failed to get exposed module ${exposed} from ${config.key}`, e);
          return mod;
        }
      }

      // Check if module loaded successfully (non-container case)
      if (!mod || (!mod.default && Object.keys(mod).length === 0)) {
        console.warn(`[RemoteLoader] Module loaded but empty for ${config.key}`);
        return mod;
      }

      return mod;
    } catch (error: any) {
      // Suppress ws-related errors; they don't prevent remote loading
      const errorMsg = (error?.message || error?.toString?.() || String(error)).toLowerCase();
      if (errorMsg.includes('ws') || errorMsg.includes('websocket')) {
        console.warn(`[RemoteLoader] Ignoring ws/WebSocket error for ${config.key}: ${errorMsg}`);
        // Return a stub module that won't crash; container initialization will fail gracefully
        return { default: undefined };
      }
      console.error(`Failed to load remote ${config.key}:`, error);
      throw error;
    }
  }

  private async loadRemoteModule(entry: string): Promise<any> {
    // Monkeypatch WebSocket to prevent 'ws' module from throwing
    const originalWebSocket = (window as any).WebSocket;
    const noop = () => {};
    
    // Create a fake WebSocket that won't throw
    const FakeWebSocket = function() {
      return {
        send: noop,
        close: noop,
        addEventListener: noop,
        removeEventListener: noop,
      };
    };
    FakeWebSocket.prototype = {
      send: noop,
      close: noop,
      addEventListener: noop,
      removeEventListener: noop,
    };
    
    try {
      // Temporarily replace WebSocket
      (window as any).WebSocket = FakeWebSocket;
      
      // Try direct import first
      try {
        const mod = await import(/* @vite-ignore */ entry);
        return this.ngZone.run(() => mod);
      } catch (importError: any) {
        // If direct import fails, try fetching and using blob URL
        console.log('[RemoteLoader] Direct import failed, trying blob URL approach');
        const response = await fetch(entry);
        const code = await response.text();
        
        // Create blob and import from it
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        
        try {
          const mod = await import(/* @vite-ignore */ blobUrl);
          return this.ngZone.run(() => mod);
        } finally {
          URL.revokeObjectURL(blobUrl);
        }
      }
    } finally {
      // Restore original WebSocket
      (window as any).WebSocket = originalWebSocket;
    }
  }

  getMetadata$(): Observable<any> {
    return this.metadataMap$.asObservable();
  }

  unload(key: string): void {
    console.log(`Unloading remote: ${key}`);
  }
}
