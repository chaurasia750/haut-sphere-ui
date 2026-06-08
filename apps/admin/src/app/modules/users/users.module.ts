import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { UiBreadcrumbComponent } from '@shared/ui/src';

@NgModule({
  declarations: [UsersPageComponent],
  imports: [CommonModule, UsersRoutingModule, UiBreadcrumbComponent],
})
export class UsersModule {}
