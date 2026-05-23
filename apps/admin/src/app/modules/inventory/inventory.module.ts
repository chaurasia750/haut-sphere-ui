import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { AddInventoryPageComponent } from './pages/add-inventory-page/add-inventory-page.component';
import { InventoryDetailsPageComponent } from './pages/inventory-details-page/inventory-details-page.component';
import { InventoryListPageComponent } from './pages/inventory-list-page/inventory-list-page.component';
import { InventoryEditPageComponent } from './pages/inventory-edit-page/inventory-edit-page.component';
import { InventoryFormComponent } from '@shared/inventory/src';
import { InventoryListComponent } from '@shared/inventory/src';
import { InventoryDetailsComponent } from '@shared/inventory/src';
import { INVENTORY_PAYLOAD_BUILDER, InventoryPayloadBuilder } from '@shared/inventory/src';
import { PROPERTY_FIELD_MAPPER, PropertyFieldMapper } from '@shared/inventory/src';

@NgModule({
  declarations: [
    AddInventoryPageComponent,
    InventoryDetailsPageComponent,
    InventoryListPageComponent,
    InventoryEditPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    InventoryFormComponent,
    InventoryListComponent,
    InventoryDetailsComponent,
  ],
  providers: [
    { provide: INVENTORY_PAYLOAD_BUILDER, useClass: InventoryPayloadBuilder },
    { provide: PROPERTY_FIELD_MAPPER, useClass: PropertyFieldMapper },
  ],
})
export class InventoryModule {}
