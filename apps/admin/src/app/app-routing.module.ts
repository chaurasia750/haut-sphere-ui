import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./modules/leads/leads.module').then(
            (m) => m.LeadsModule
          ),
      },
      {
        path: 'tree',
        loadChildren: () =>
          import('./modules/tree-visualization/tree-visualization.module').then(
            (m) => m.TreeVisualizationModule
          ),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./modules/inventory/inventory.module').then(
            (m) => m.InventoryModule
          ),
      },
      {
        path: 'members',
        loadChildren: () =>
          import('./modules/members/members.module').then(
            (m) => m.MembersModule
          ),
      },
      {
        path: 'sponsor-new',
        loadComponent: () =>
          import('./features/sponsor-new/sponsor-new.component').then(
            (m) => m.AdminSponsorNewComponent
          ),
      },
    ],
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class AppRoutingModule {}

export { routes };
