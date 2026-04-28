import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () => import('admin/Module').then(m => m.AppModule),
  },
  {
    path: 'member',
    loadChildren: () => import('member/Module').then(m => m.AppModule),
  },
  {
    path: 'management',
    loadChildren: () => import('management/Module').then(m => m.AppModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
