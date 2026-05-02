import { Component } from "@angular/core";

@Component({
  selector: "app-distributor-details",
  imports: [],
  templateUrl: "./distributor-details.component.html",
})
export class DistributorDetailsComponent {
  distributorDetails = {
    userName: "Companyid",
    name: "Mr. BIT SCHOLARS",
    dateOfJoining: "21-09-2025",
    designation: "DISTRIBUTOR",
    sponsorUserID: "N/A",
    sponsorName: "N/A",
    directMember: "4/5",
  };
}
