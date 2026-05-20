import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AddInventoryPageComponent } from './pages/add-inventory-page/add-inventory-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-property',
    pathMatch: 'full',
  },
  {
    path: 'add-property',
    component: AddInventoryPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class InventoryRoutingModule {}
