import { NgModule } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';
import { AddInventoryPageComponent } from './pages/add-inventory-page/add-inventory-page.component';
import { InventoryDetailsPageComponent } from './pages/inventory-details-page/inventory-details-page.component';
import { InventoryListPageComponent } from './pages/inventory-list-page/inventory-list-page.component';
import { InventoryEditPageComponent } from './pages/inventory-edit-page/inventory-edit-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: InventoryListPageComponent,
  },
  {
    path: 'add-inventory',
    component: AddInventoryPageComponent,
  },
  {
    path: ':id',
    component: InventoryDetailsPageComponent,
  },
  {
    path: ':id/edit',
    component: InventoryEditPageComponent,
  },
];

@NgModule({
  providers: [
    { provide: ROUTES, multi: true, useValue: routes },
  ],
})
export class InventoryRoutingModule {}
