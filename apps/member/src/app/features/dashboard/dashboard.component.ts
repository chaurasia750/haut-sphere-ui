import { Component } from '@angular/core';
import { MatrixComponent } from './components/matrix/matrix.component';
import { SponsorMembersComponent } from "./components/sponsor-members/sponsor-members.component";
import { DistributorDetailsComponent } from '../../shared/components/distributor-details/distributor-details.component';
import { SharedSidePanelComponent } from '@shared/ui/src';

@Component({
  selector: 'app-dashboard',
  imports: [MatrixComponent, SponsorMembersComponent, DistributorDetailsComponent, SharedSidePanelComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  isPanelOpen = false;

  openPanel(): void {
    this.isPanelOpen = true;
  }

  onPanelClosed(): void {
    this.isPanelOpen = false;
  }
}
