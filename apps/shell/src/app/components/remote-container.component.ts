import { Component, OnInit, ViewContainerRef, Input, NgModuleFactory, NgModuleRef, Injector, EnvironmentInjector, createNgModuleRef, createEnvironmentInjector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RemoteConfig } from '@shared/types';
import { RemoteLoaderService } from '../services/remote-loader.service';

@Component({
  selector: 'app-remote-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 16px; background: #f9fafb; border-radius: 4px;">
      <p style="color: #666; margin: 0;">RemoteContainerComponent is rendering</p>
      @if (remoteConfig) {
      <p style="color: #333; font-weight: bold; margin: 8px 0;">
        Loading: {{ remoteConfig.displayName }}
      </p>
      }
      @if (loading) {
      <p style="color: #2563eb;">⏳ Loading remote...</p>
      }
      @if (error) {
      <p style="color: #dc2626; background: #fee2e2; padding: 8px; border-radius: 2px; margin: 8px 0;">
        ❌ Error: {{ error }}
      </p>
      }
      <div #remoteContent></div>
    </div>
  `
})
export class RemoteContainerComponent implements OnInit {
  @Input() remoteConfig?: RemoteConfig;
  loading = false;
  error: string | null = null;
  private loadedComponent: any;

  constructor(
    private route: ActivatedRoute,
    private viewContainer: ViewContainerRef,
    private remoteLoader: RemoteLoaderService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    if (!this.remoteConfig) {
      this.remoteConfig = this.route.snapshot.data['remoteConfig'];
    }

    console.log('RemoteContainerComponent init:', { config: this.remoteConfig });

    if (this.remoteConfig?.entry) {
      this.loadRemote();
    }
  }

  private async loadRemote(): Promise<void> {
    if (!this.remoteConfig) return;

    try {
      this.loading = true;
      this.error = null;
      console.log(`Loading remote from: ${this.remoteConfig.entry}`);
      const module = await this.remoteLoader.load(this.remoteConfig);
      console.log('Loaded module:', { module, type: typeof module });

      if (!module) {
        this.error = 'Module failed to load - empty response';
        this.loading = false;
        return;
      }

      this.loading = false;
      // Successfully loaded - show confirmation
      const placeholder = document.createElement('div');
      placeholder.style.cssText = 'padding: 16px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724; margin-top: 8px;';
      placeholder.innerHTML = `✅ <strong>${this.remoteConfig.displayName || 'Remote'}</strong> loaded successfully`;
      const container = this.viewContainer.element?.nativeElement;
      if (container && container.parentNode) {
        container.parentNode.appendChild(placeholder);
      }
      // Try rendering the remote's primary component (if one was exported)
      try {
        const componentType = this.extractComponent(module);
        if (componentType) {
          // If the remote exposes an NgModule, create an NgModuleRef to provide proper
          // environment injector so `inject()` calls in factories/field initializers work.
          const ngModuleType = this.extractNgModule(module);
          if (ngModuleType) {
            try {
              const moduleRef = createNgModuleRef(ngModuleType, this.injector);
              // Try to obtain an EnvironmentInjector from the moduleRef first
              let moduleEnv: EnvironmentInjector | null = null as any;
              try {
                moduleEnv = (moduleRef.injector as any).get?.(EnvironmentInjector, null) as any;
              } catch (e) {
                // ignore
              }

              // Fallback: try to get host view's EnvironmentInjector
              let hostEnv: EnvironmentInjector | null = null as any;
              try {
                hostEnv = (this.viewContainer.injector as any).get?.(EnvironmentInjector, null) as any;
              } catch (e) {
                try {
                  hostEnv = (this.injector as any).get?.(EnvironmentInjector, null) as any;
                } catch (e2) {
                  hostEnv = null as any;
                }
              }

              const envToUse = moduleEnv || hostEnv;

              this.viewContainer.clear();
              if (envToUse) {
                this.viewContainer.createComponent(componentType as any, {
                  environmentInjector: envToUse as any,
                } as any);
              } else {
                // Create a minimal environment injector that provides `Title` from host
                try {
                  const hostTitle = this.injector.get(Title);
                  const fallbackEnv = createEnvironmentInjector([{ provide: Title, useValue: hostTitle }], this.injector as any);
                  this.viewContainer.createComponent(componentType as any, {
                    environmentInjector: fallbackEnv as any,
                  } as any);
                } catch (titleErr) {
                  // Last resort: use plain injector
                  this.viewContainer.createComponent(componentType as any, {
                    injector: this.injector as any,
                  } as any);
                }
              }
            } catch (moduleErr) {
              console.warn('Failed to create NgModuleRef for remote, falling back to host injector', moduleErr);
              try {
                const hostEnv = (this.viewContainer.injector as any).get?.(EnvironmentInjector, null) as any;
                if (hostEnv) {
                  this.viewContainer.clear();
                  this.viewContainer.createComponent(componentType as any, {
                    environmentInjector: hostEnv as any,
                  } as any);
                } else {
                  try {
                    const hostTitle = this.injector.get(Title);
                    const fallbackEnv = createEnvironmentInjector([{ provide: Title, useValue: hostTitle }], this.injector as any);
                    this.viewContainer.clear();
                    this.viewContainer.createComponent(componentType as any, {
                      environmentInjector: fallbackEnv as any,
                    } as any);
                  } catch (titleErr) {
                    this.viewContainer.clear();
                    this.viewContainer.createComponent(componentType as any, {
                      injector: this.injector as any,
                    } as any);
                  }
                }
              } catch (hostErr) {
                this.viewContainer.clear();
                this.viewContainer.createComponent(componentType as any, {
                  injector: this.injector as any,
                } as any);
              }
            }
          } else {
            // No NgModule exported — create an EnvironmentInjector from the host injector
            // so that `inject()` calls inside the component factory (used by AOT) work.
            try {
              const envInj = createEnvironmentInjector([], this.injector as any);
              this.viewContainer.clear();
              this.viewContainer.createComponent(componentType as any, {
                environmentInjector: envInj as any,
              } as any);
            } catch (envErr) {
              console.warn('Failed to create environment injector fallback, using injector fallback', envErr);
              this.viewContainer.clear();
              this.viewContainer.createComponent(componentType as any, {
                injector: this.injector as any,
              } as any);
            }
          }
        }
      } catch (renderErr) {
        console.error('Error rendering remote component:', renderErr);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Failed to load remote:', error);
      this.error = `Load error: ${errorMsg.substring(0, 100)}`;
      this.loading = false;
    }
  }

  private extractNgModule(module: any): any {
    if (!module) return null;
    if (module?.ɵmod) return module;
    if (module?.default?.ɵmod) return module.default;
    if (module?.AppModule?.ɵmod) return module.AppModule;
    
    const keys = Object.keys(module || {});
    for (const key of keys) {
      if (module[key]?.ɵmod) return module[key];
    }
    return null;
  }

  private extractComponent(module: any): any {
    if (!module) {
      console.warn('[RemoteContainer] No module provided');
      return null;
    }

    console.log('[RemoteContainer] Extracting component from module:', {moduleType: typeof module, hasDefault: !!module.default});

    // Case 1: Module itself is a component
    if (module?.ɵcmp) {
      console.log('[RemoteContainer] Found component directly in module');
      return module;
    }

    // Case 2: Module has default export that is a component
    if (module?.default?.ɵcmp) {
      console.log('[RemoteContainer] Found component in module.default');
      return module.default;
    }

    // Case 3: Module has AppComponent or AppModule
    if (module?.AppComponent?.ɵcmp) {
      console.log('[RemoteContainer] Found component in module.AppComponent');
      return module.AppComponent;
    }

    // Case 4: Module has AppModule (need to extract first component from declarations)
    if (module?.AppModule?.ɵmod) {
      console.log('[RemoteContainer] Found AppModule, extracting component from declarations');
      const decls = module.AppModule.ɵmod?.declarations;
      if (Array.isArray(decls)) {
        const cmp = decls.find((d: any) => d && typeof d === 'function' && d.ɵcmp);
        if (cmp) {
          console.log('[RemoteContainer] Found component in AppModule declarations:', {name: cmp.name});
          return cmp;
        }
      }
    }

    // Case 5: default export is an NgModule
    if (module?.default?.ɵmod) {
      console.log('[RemoteContainer] Found NgModule in module.default, extracting component');
      const decls = module.default.ɵmod?.declarations;
      if (Array.isArray(decls)) {
        const cmp = decls.find((d: any) => d && typeof d === 'function' && d.ɵcmp);
        if (cmp) {
          console.log('[RemoteContainer] Found component in default module declarations:', {name: cmp.name});
          return cmp;
        }
      }
    }

    // Case 6: Check all keys for any component
    const keys = Object.keys(module || {});
    for (const key of keys) {
      if (module[key]?.ɵcmp) {
        console.log('[RemoteContainer] Found component at module[' + key + ']');
        return module[key];
      }
    }

    // Case 7: Check all keys for any NgModule (last resort)
    for (const key of keys) {
      if (module[key]?.ɵmod) {
        console.log('[RemoteContainer] Found NgModule at module[' + key + '], extracting first component');
        const decls = module[key].ɵmod?.declarations;
        if (Array.isArray(decls)) {
          const cmp = decls.find((d: any) => d && typeof d === 'function' && d.ɵcmp);
          if (cmp) {
            console.log('[RemoteContainer] Found component in module[' + key + '] declarations');
            return cmp;
          }
        }
      }
    }

    console.warn('[RemoteContainer] No component found in module. Keys:', Object.keys(module).slice(0, 20));
    return null;
  }
}
