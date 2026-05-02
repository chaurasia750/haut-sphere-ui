import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DistributorDetailsComponent } from '../../../shared/components/distributor-details/distributor-details.component';

@Component({
  selector: 'app-level-details',
  imports: [PageBreadcrumbComponent, DistributorDetailsComponent],
  templateUrl: './level-details.component.html',
})
export class LevelDetailsComponent {
  tableRowData = [
    {
      level: 'level 1 [ DIRECT ]',
      noOfMember: 4,
      perIdRate: '20.00',
      amount: '560.00',
    },
    {
      level: 'level 2 [ INDIRECT ]',
      noOfMember: 4,
      perIdRate: '15.00',
      amount: '1500.00',
    },
    {
      level: 'level 3 [ INDIRECT ]',
      noOfMember: 7,
      perIdRate: '10.00',
      amount: '1060.00',
    },
    {
      level: 'level 4 [ INDIRECT ]',
      noOfMember: 0,
      perIdRate: '8.00',
      amount: '0',
    },
    {
      level: 'level 5 [ INDIRECT ]',
      noOfMember: 4,
      perIdRate: '5.00',
      amount: '0',
    },
    {
      level: 'level 6 [ INDIRECT ]',
      noOfMember: 4,
      perIdRate: '20.00',
      amount: '0',
    },
    {
      level: 'level 7 [ INDIRECT ]',
      noOfMember: 4,
      perIdRate: '4.00',
      amount: '0',
    },
    {
      level: 'level 8 [ INDIRECT ]',
      noOfMember: 4,
      perIdRate: '3.00',
      amount: '0',
    },
  ];
}
