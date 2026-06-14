import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { UiBreadcrumbComponent } from '@shared/ui/src';
import { MemberListComponent } from '@shared/members/src';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [CommonModule, DashboardRoutingModule, UiBreadcrumbComponent, MemberListComponent],
})
export class DashboardModule {}
