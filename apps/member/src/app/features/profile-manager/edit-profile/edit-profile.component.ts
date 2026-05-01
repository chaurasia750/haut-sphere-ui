import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserMetaCardComponent } from '../../../shared/components/user-profile/user-meta-card/user-meta-card.component';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserMetaCardComponent,
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent {

}
