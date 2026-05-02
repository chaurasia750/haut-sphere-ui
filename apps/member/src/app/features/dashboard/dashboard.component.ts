import { Component } from '@angular/core';
import { MatrixComponent } from './components/matrix/matrix.component';
import { SponsorMembersComponent } from "./components/sponsor-members/sponsor-members.component";
import { DistributorDetailsComponent } from '../../shared/components/distributor-details/distributor-details.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatrixComponent, SponsorMembersComponent, DistributorDetailsComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
