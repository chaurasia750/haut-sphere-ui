import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AdminLeadsPageComponent } from './pages/leads-page/leads-page.component';
import { AdminLeadsListPageComponent } from './pages/leads-list-page/leads-list-page.component';
import { AdminLeadsAddPageComponent } from './pages/leads-add-page/leads-add-page.component';
import { AdminLeadsDetailPageComponent } from './pages/leads-detail-page/leads-detail-page.component';
import { AdminLeadsEditPageComponent } from './pages/leads-edit-page/leads-edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLeadsPageComponent,
  },
  {
    path: 'list',
    component: AdminLeadsListPageComponent,
  },
  {
    path: 'add',
    component: AdminLeadsAddPageComponent,
  },
  {
    path: ':id',
    component: AdminLeadsDetailPageComponent,
  },
  {
    path: ':id/edit',
    component: AdminLeadsEditPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class LeadsRoutingModule {}
