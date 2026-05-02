import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/pages/login/login.component';
import { UnauthorizedComponent } from './features/error/pages/unauthorized/unauthorized.component';
import { AdminRedirectComponent } from './modules/admin-redirect/admin-redirect.component';
import { MemberRedirectComponent } from './modules/member-redirect/member-redirect.component';
import { ManagementRedirectComponent } from './modules/management-redirect/management-redirect.component';
import { authGuard } from './core/guards/auth.guard';
import { RoleId } from '@libs/shared/auth';

const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },

  // Error routes
  {
    path: 'error',
    children: [
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
        data: { title: 'Access Denied' }
      }
    ]
  },

  // Protected routes with role guards

  // Admin Module (Roles 1, 2)
  {
    path: 'admin',
    component: AdminRedirectComponent,
    canActivate: [authGuard],
    data: {
      title: 'Admin Dashboard',
      roles: [RoleId.SYSTEM_ADMIN, RoleId.ADMIN] // [1, 2]
    }
  },

  // Member Module (Role 3)
  {
    path: 'member',
    component: MemberRedirectComponent,
    // canActivate: [authGuard],  // Temporarily disabled for route verification
    data: {
      title: 'Member Portal',
      roles: [RoleId.MEMBER] // [3]
    }
  },

  // Management Module (Role 4)
  {
    path: 'management',
    component: ManagementRedirectComponent,
    canActivate: [authGuard],
    data: {
      title: 'Management Console',
      roles: [RoleId.MANAGER] // [4]
    }
  },

  // Default redirect
  {
    path: '',
    redirectTo: 'member',
    pathMatch: 'full'
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: 'member'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
