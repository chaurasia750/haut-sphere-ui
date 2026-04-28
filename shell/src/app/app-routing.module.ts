import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '@shared';
import { RemoteContainerComponent } from './components/remote-container.component';
import { remoteConfig } from '../environments/remotes.dev.config';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    
    component: RemoteContainerComponent,
    data: {
      remoteConfig: {
        key: 'home',
        route: '/home',
        displayName: 'Home'
      }
    }
  },
  {
    path: 'admin',
    
    component: RemoteContainerComponent,
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'admin'),
      roles: ['admin']
    }
  },
  {
    path: 'member',
    
    component: RemoteContainerComponent,
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'member'),
      roles: ['member']
    }
  },
  {
    path: 'management',
    
    component: RemoteContainerComponent,
    data: {
      remoteConfig: remoteConfig.find((c: any) => c.key === 'management'),
      roles: ['management']
    }
  },
  {
    path: 'unauthorized',
    component: RemoteContainerComponent,
    data: { error: 'unauthorized' }
  },
  {
    path: '404',
    component: RemoteContainerComponent,
    data: { error: 'notfound' }
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
