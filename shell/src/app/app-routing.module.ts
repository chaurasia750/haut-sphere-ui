import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';
import { AdminRedirectComponent } from './modules/admin-redirect/admin-redirect.component';
import { MemberRedirectComponent } from './modules/member-redirect/member-redirect.component';
import { ManagementRedirectComponent } from './modules/management-redirect/management-redirect.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
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
    component: AdminRedirectComponent,
  },
  {
    path: 'member',
    component: MemberRedirectComponent,
  },
  {
    path: 'management',
    component: ManagementRedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
