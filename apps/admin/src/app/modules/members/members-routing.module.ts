import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AdminMembersListPageComponent } from './pages/members-list-page/members-list-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: AdminMembersListPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class MembersRoutingModule {}
