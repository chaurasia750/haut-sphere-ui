import { Component, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { RemoteConfig, RemoteMetadata } from '@shared';
import { RemoteLoaderService } from '../services/remote-loader.service';
import { RemoteePlaceholderComponent } from './remote-placeholder.component';
import { Subject, Observable, map } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Remote Container Component
 * Dynamically loads and renders remote applications
 * Handles lifecycle management and error states
 */
@Component({
  selector: 'app-remote-container',
  standalone: true,
  imports: [CommonModule, RouterModule, RemoteePlaceholderComponent],
  template: `
    <div class="remote-container">
      <!-- Show placeholder while loading or on error -->
      <ng-container *ngIf="metadata$ | async as metadataMap">
        <app-remote-placeholder
          *ngIf="getRemoteMetadata(metadataMap) as metadata; else placeholder"
          [metadata]="metadata"
          [remoteKey]="remoteConfig?.key"
          [displayName]="remoteConfig?.displayName || 'Remote'"
          (retry)="retryLoad()"
          [ngClass]="{ 'hidden': metadata.state === 'loaded' }">
        </app-remote-placeholder>
      </ng-container>

      <!-- Remote component renders here -->
      <div #remoteContent></div>

      <ng-template #placeholder>
        <app-remote-placeholder
          [displayName]="remoteConfig?.displayName || 'Remote'">
        </app-remote-placeholder>
      </ng-template>
    </div>
  `,
  styles: [`
    .remote-container {
      position: relative;
      min-height: 200px;
    }

    .hidden {
      display: none;
    }
  `]
})
export class RemoteContainerComponent implements OnInit, OnDestroy {
  @Input() remoteConfig?: RemoteConfig;

  metadata$: Observable<any>;
  private loadedComponent: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private viewContainer: ViewContainerRef,
    private remoteLoader: RemoteLoaderService
  ) {
    this.metadata$ = this.remoteLoader.getMetadata$();
  }

  ngOnInit(): void {
    // Get config from route data if not provided as input
    if (!this.remoteConfig) {
      this.remoteConfig = this.route.snapshot.data['remoteConfig'];
    }

    if (this.remoteConfig) {
      // Load the remote
      this.loadRemote();
    }
  }

  getRemoteMetadata(metadataMap: any): RemoteMetadata | undefined {
    if (!this.remoteConfig) return undefined;
    return metadataMap[this.remoteConfig.key];
  }

  private async loadRemote(): Promise<void> {
    if (!this.remoteConfig) return;

    try {
      const module = await this.remoteLoader.load(this.remoteConfig);
      const component = this.getComponentFromModule(module);

      if (component) {
        this.loadedComponent = this.viewContainer.createComponent(component);
      }
    } catch (error) {
      console.error('Failed to load remote:', error);
    }
  }

  private getComponentFromModule(module: any): any {
    // Try different patterns to extract component from module
    
    // 1. Check if it's a standalone component
    if (module?.ɵcmp) {
      return module;
    }

    // 2. Check if it's an NgModule with bootstrap
    if (module?.default) {
      const moduleClass = module.default;
      if (moduleClass.ɵmod?.bootstrap?.[0]) {
        return moduleClass.ɵmod.bootstrap[0];
      }
    }

    // 3. Check for AppComponent export
    if (module?.AppComponent) {
      return module.AppComponent;
    }

    // 4. Check for default export
    if (module?.default) {
      return module.default;
    }

    // 5. Return first exported component
    const keys = Object.keys(module || {});
    for (const key of keys) {
      if (key !== 'default' && module[key]?.ɵcmp) {
        return module[key];
      }
    }

    return null;
  }

  retryLoad(): void {
    this.viewContainer.clear();
    this.loadRemote();
  }

  ngOnDestroy(): void {
    // Unload remote when component is destroyed
    if (this.remoteConfig) {
      this.remoteLoader.unload(this.remoteConfig.key);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
