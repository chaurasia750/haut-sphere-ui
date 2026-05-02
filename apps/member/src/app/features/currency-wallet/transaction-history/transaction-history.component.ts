import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { DistributorDetailsComponent } from "../../../shared/components/distributor-details/distributor-details.component";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";

interface Transaction {
  sn: number;
  date: string;
  payoutNo: string;
  particulars: string;
  debit: string;
  credit: string;
}

@Component({
  selector: "app-transaction-history",
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    DistributorDetailsComponent,
  ],
  templateUrl: "./transaction-history.component.html",
})
export class TransactionHistoryComponent {
  transactionData: Transaction[] = [
    {
      sn: 1,
      payoutNo: "BIT000001",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 2,
      payoutNo: "BIT000002",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 3,
      payoutNo: "BIT000003",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 4,
      payoutNo: "BIT000004",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 5,
      payoutNo: "BIT000005",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 6,
      payoutNo: "BIT000006",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 7,
      payoutNo: "BIT000007",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 8,
      payoutNo: "BIT000008",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 9,
      payoutNo: "BIT000009",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 10,
      payoutNo: "BIT000010",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 11,
      payoutNo: "BIT000006",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 12,
      payoutNo: "BIT000007",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 13,
      payoutNo: "BIT000008",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 14,
      payoutNo: "BIT000009",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
    {
      sn: 15,
      payoutNo: "BIT000010",
      date: "21/09/2025",
      particulars: "HRISHIKESH TENI",
      debit: "0.00",
      credit: "100.00",
    },
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
