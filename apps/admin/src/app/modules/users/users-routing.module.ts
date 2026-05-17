import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users-page/users-page.component';

const routes: Routes = [
  {
    path: '',
    component: UsersPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class UsersRoutingModule {}
