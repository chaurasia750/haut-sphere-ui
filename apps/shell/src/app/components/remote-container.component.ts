import { Component, OnInit, Input } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, Route } from '@angular/router';
import { RemoteConfig } from '@shared/types';
import { RemoteLoaderService } from '../services/remote-loader.service';

@Component({
  selector: 'app-remote-container',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (loading) {
      <p>Loading remote module...</p>
    }
    @if (error) {
      <p style="color: red">{{ error }}</p>
    }
    <router-outlet />
  `
})
export class RemoteContainerComponent implements OnInit {
  @Input() remoteConfig?: RemoteConfig;
  loading = false;
  error: string | null = null;
  private routesLoaded = false;

  constructor(
    private remoteLoader: RemoteLoaderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (!this.remoteConfig) {
      this.remoteConfig = this.route.snapshot.data['remoteConfig'];
    }

    if (this.remoteConfig?.entry && !this.routesLoaded) {
      this.loadRemote();
    }
  }

  private async loadRemote(): Promise<void> {
    if (!this.remoteConfig) return;

    try {
      this.loading = true;
      this.error = null;

      const module = await this.remoteLoader.load(this.remoteConfig);

      if (!module) {
        this.error = 'Module failed to load';
        this.loading = false;
        return;
      }

      this.loading = false;

      const remoteRoutes: Route[] = module?.adminRoutes || module?.routes || module?.default?.adminRoutes || module?.default?.routes;
      if (!remoteRoutes || !Array.isArray(remoteRoutes)) {
        this.error = 'Remote module has no routes';
        return;
      }

      const mountPath = (this.remoteConfig.route || '').replace(/^\/+/, '').replace(/\/+$/, '');

      const config = [...this.router.config];
      const idx = config.findIndex(r => r.path === mountPath);
      if (idx >= 0) {
        this.routesLoaded = true;
        config[idx] = { ...config[idx], children: remoteRoutes };
        this.router.resetConfig(config);
        console.log(`[RemoteContainer] Added routes as children of /${mountPath}`, remoteRoutes);

        const targetUrl = this.router.url === '/' + mountPath
          ? '/' + mountPath + '/dashboard'
          : this.router.url;
        this.router.navigateByUrl(targetUrl);
      }
    } catch (err) {
      this.error = `Load error: ${err instanceof Error ? err.message : String(err)}`;
      this.loading = false;
      console.error('RemoteContainer loadRemote error:', err);
    }
  }
}
