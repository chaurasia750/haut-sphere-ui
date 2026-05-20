import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AddPropertyPageComponent } from './pages/add-property-page/add-property-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-property',
    pathMatch: 'full',
  },
  {
    path: 'add-property',
    component: AddPropertyPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class InventoryRoutingModule {}
