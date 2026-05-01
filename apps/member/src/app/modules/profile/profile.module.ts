import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedLayoutModule } from '@shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [CommonModule, SharedLayoutModule, ProfileRoutingModule],
})
export class ProfileModule {}
