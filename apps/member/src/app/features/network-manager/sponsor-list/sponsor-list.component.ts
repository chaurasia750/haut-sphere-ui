import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { CommonModule } from "@angular/common";
import { DistributorDetailsComponent } from "../../../shared/components/distributor-details/distributor-details.component";

interface Transaction {
  siNo: number;
  username: string;
  name: string;
  registrationDate: string;
  mobile: string;
  package: string;
  noofMembers: number;
  status: "Success" | "Pending" | "Failed";
}

@Component({
  selector: "app-sponsor-list",
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    BadgeComponent,
    ButtonComponent,
    DistributorDetailsComponent
  ],
  templateUrl: "./sponsor-list.component.html",
})
export class SponsorListComponent {
  transactionData: Transaction[] = [
    {
      siNo: 1,
      username: "john_doe",
      name: "John Doe",
      registrationDate: "2023-10-01",
      mobile: "+1234567890",
      package: "Gold",
      noofMembers: 5,
      status: "Success",
    },
    {
      siNo: 2,
      username: "jane_smith",
      name: "Jane Smith",
      registrationDate: "2023-10-05",
      mobile: "+0987654321",
      package: "Silver",
      noofMembers: 3,
      status: "Pending",
    },
    {
      siNo: 3,
      username: "alice_wonder",
      name: "Alice Wonder",
      registrationDate: "2023-10-10",
      mobile: "+1122334455",
      package: "Platinum",
      noofMembers: 8,
      status: "Failed",
    },
    {
      siNo: 4,
      username: "bob_builder",
      name: "Bob Builder",
      registrationDate: "2023-10-12",
      mobile: "+6677889900",
      package: "Gold",
      noofMembers: 4,
      status: "Success",
    },
    {
      siNo: 5,
      username: "charlie_brown",
      name: "Charlie Brown",
      registrationDate: "2023-10-15",
      mobile: "+4455667788",
      package: "Silver",
      noofMembers: 2,
      status: "Pending",
    },
    {
      siNo: 6,
      username: "diana_prince",
      name: "Diana Prince",
      registrationDate: "2023-10-18",
      mobile: "+2233445566",
      package: "Platinum",
      noofMembers: 6,
      status: "Success",
    },
    {
      siNo: 7,
      username: "edward_snow",
      name: "Edward Snow",
      registrationDate: "2023-10-20",
      mobile: "+3344556677",
      package: "Gold",
      noofMembers: 7,
      status: "Failed",
    },
    {
      siNo: 8,
      username: "fiona_apple",
      name: "Fiona Apple",
      registrationDate: "2023-10-22",
      mobile: "+5566778899",
      package: "Silver",
      noofMembers: 1,
      status: "Success",
    },
    {
      siNo: 9,
      username: "george_clark",
      name: "George Clark",
      registrationDate: "2023-10-25",
      mobile: "+7788990011",
      package: "Platinum",
      noofMembers: 9,
      status: "Pending",
    },
    {
      siNo: 10,
      username: "hannah_montana",
      name: "Hannah Montana",
      registrationDate: "2023-10-28",
      mobile: "+8899001122",
      package: "Gold",
      noofMembers: 4,
      status: "Success",
    },
    {
      siNo: 11,
      username: "ian_somers",
      name: "Ian Somers",
      registrationDate: "2023-10-30",
      mobile: "+9900112233",
      package: "Silver",
      noofMembers: 3,
      status: "Failed",
    },
    {
      siNo: 12,
      username: "julia_roberts",
      name: "Julia Roberts",
      registrationDate: "2023-11-01",
      mobile: "+1011121314",
      package: "Platinum",
      noofMembers: 10,
      status: "Success",
    },
    {
      siNo: 13,
      username: "kevin_bacon",
      name: "Kevin Bacon",
      registrationDate: "2023-11-03",
      mobile: "+1213141516",
      package: "Gold",
      noofMembers: 5,
      status: "Pending",
    },
    {
      siNo: 14,
      username: "linda_hall",
      name: "Linda Hall",
      registrationDate: "2023-11-05",
      mobile: "+1314151617",
      package: "Silver",
      noofMembers: 2,
      status: "Success",
    },
    {
      siNo: 15,
      username: "michael_jordan",
      name: "Michael Jordan",
      registrationDate: "2023-11-07",
      mobile: "+1415161718",
      package: "Platinum",
      noofMembers: 8,
      status: "Failed",
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

  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Success") return "success";
    if (status === "Pending") return "warning";
    return "error";
  }
}
