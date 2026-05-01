import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-referral-link',
  imports: [ComponentCardComponent, PageBreadcrumbComponent],
  templateUrl: './referral-link.component.html',
})
export class ReferralLinkComponent {

}
