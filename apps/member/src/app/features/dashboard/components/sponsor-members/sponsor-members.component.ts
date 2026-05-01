import { Component } from '@angular/core';

interface Product {
  id: number;
  userName: string;
  name: string;
  date: string;
}

@Component({
  selector: 'app-sponsor-members',
  imports: [],
  templateUrl: './sponsor-members.component.html',
})
export class SponsorMembersComponent {
  tableData: Product[] = [
    {
      id: 1,
      userName: "BIT000001",
      name: "Mr. HRISHIKESH TENI",
      date: "21-09-2025",
    },
    {
      id: 2,
      userName: "BIT000002",
      name: "MR. RAJENDRA BHAVSAR",
      date: "21-09-2025",
    },
    {
      id: 3,
      userName: "BIT000003",
      name: "MR. DARSHAN BHAVSAR",
      date: "21-09-2025",
    },
    {
      id: 4,
      userName: "BIT000030",
      name: "MR. BHARATI SHINDE",
      date: "26-09-2025",
    },
    {
      id: 5,
      userName: "BIT000036",
      name: "MR. AB SINGH",
      date: "04-10-2025",
    },
  ];
}
