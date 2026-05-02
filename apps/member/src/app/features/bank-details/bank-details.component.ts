import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';

interface Transaction {
  sn: number;
  bankName: string;
  accountName: string;
  accountNo: string;
  ifsc: string;
  branchName: string;
}

@Component({
  selector: 'app-bank-details',
  imports: [CommonModule, PageBreadcrumbComponent, ButtonComponent],
  templateUrl: './bank-details.component.html',
})
export class BankDetailsComponent {
  transactionData = [
    {
      sn: 1,
      bankName: "SBI",
      accountName: "BITScholars",
      accountNo: "0000000000",
      ifsc: "SBI000001",
      branchName: "Amalner",
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
