import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { DistributorDetailsComponent } from '../../../shared/components/distributor-details/distributor-details.component';

interface Transaction {
  sn: number;
  username: string;
  name: string;
  registrationDate: string;
}

@Component({
  selector: 'app-downline-list',
  imports: [CommonModule, PageBreadcrumbComponent, ButtonComponent, DistributorDetailsComponent],
  templateUrl: './downline-list.component.html',
})
export class DownlineListComponent {
  transactionData: Transaction[] = [
    {
      sn: 1,
      username: "BIT000001",
      name: "HRISHIKESH TENI",
      registrationDate: "21/09/2025",
    },
    {
      sn: 2,
      username: "BIT000002",
      name: "RAJENDRA BHAVSAR",
      registrationDate: "21/09/2025",
    },
    {
      sn: 3,
      username: "BIT000003",
      name: "DARSHAN BHAVSAR",
      registrationDate: "21/09/2025",
    },
    {
      sn: 4,
      username: "BIT000004",
      name: "DNYANESHWAR TANKU PATIL",
      registrationDate: "22/09/2025",
    },
    {
      sn: 5,
      username: "BIT000005",
      name: "PANKAJ KADHARE",
      registrationDate: "22/09/2025",
    },
    {
      sn: 6,
      username: "BIT000006",
      name: "RISHIKESH BHAVSAR",
      registrationDate: "22/09/2025",
    },
    {
      sn: 7,
      username: "BIT000007",
      name: "PRERNA PATIL",
      registrationDate: "22/09/2025",
    },
    {
      sn: 8,
      username: "BIT000008",
      name: "SADAF PARVEEN SHAIKH SHABBIR",
      registrationDate: "	22/09/2025",
    },
    {
      sn: 9,
      username: "BIT000009",
      name: "HEMANT SHINDE",
      registrationDate: "22/09/2025",
    },
    {
      sn: 10,
      username: "BIT000010",
      name: "VIJAY BHIL",
      registrationDate: "22/09/2025",
    },
    {
      sn: 11,
      username: "BIT000006",
      name: "RISHIKESH BHAVSAR",
      registrationDate: "22/09/2025",
    },
    {
      sn: 12,
      username: "BIT000007",
      name: "PRERNA PATIL",
      registrationDate: "22/09/2025",
    },
    {
      sn: 13,
      username: "BIT000008",
      name: "SADAF PARVEEN SHAIKH SHABBIR",
      registrationDate: "	22/09/2025",
    },
    {
      sn: 14,
      username: "BIT000009",
      name: "HEMANT SHINDE",
      registrationDate: "22/09/2025",
    },
    {
      sn: 15,
      username: "BIT000010",
      name: "VIJAY BHIL",
      registrationDate: "22/09/2025",
    }
  ];

  currentPage = 1;
  itemsPerPage = 5;

  get currentItems(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactionData.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.transactionData.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
