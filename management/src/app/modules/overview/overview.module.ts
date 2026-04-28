import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';

@NgModule({
  declarations: [OverviewPageComponent],
  imports: [CommonModule, OverviewRoutingModule],
})
export class OverviewModule {}
