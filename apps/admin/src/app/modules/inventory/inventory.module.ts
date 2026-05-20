import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { AddInventoryPageComponent } from './pages/add-inventory-page/add-inventory-page.component';
import { DynamicFieldsCardComponent } from './pages/add-inventory-page/dynamic-fields-card/dynamic-fields-card.component';
import { InventorySummaryCardComponent } from './pages/add-inventory-page/inventory-summary-card/inventory-summary-card.component';

@NgModule({
  declarations: [AddInventoryPageComponent, DynamicFieldsCardComponent, InventorySummaryCardComponent],
  imports: [CommonModule, FormsModule, InventoryRoutingModule],
})
export class InventoryModule {}
