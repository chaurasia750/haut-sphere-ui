import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { UiBreadcrumbComponent, ConfirmDialogComponent } from '@shared/ui/src';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [CommonModule, DashboardRoutingModule, UiBreadcrumbComponent, ConfirmDialogComponent],
})
export class DashboardModule {}
