import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { AddPropertyPageComponent } from './pages/add-property-page/add-property-page.component';

@NgModule({
  declarations: [AddPropertyPageComponent],
  imports: [CommonModule, FormsModule, InventoryRoutingModule],
})
export class InventoryModule {}
