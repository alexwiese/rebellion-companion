import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Dashboard } from "../models/dashboard/dashboard";
import { DashboardService } from "../services/dashboard.service";
import { AuthService } from "../services/auth.service";
import { DateTimeService } from "../services/datetime.service";
import { PanelModule, ButtonModule, Message, Messages } from "primeng/primeng";
import { RoleType } from "app/models/people/person";
import "rxjs/add/operator/timeout";

@Component({
  selector: "aed-dashboard",
  templateUrl: "./dashboard.component.html",
  styles: [`.latest-activity { margin: 10px 0; }`]
})

export class DashboardComponent implements OnInit {
  dashboard: Dashboard;
  errors: Message[] = [];
  loading = false;
  startDateDisplay: string;
  endDateDisplay: string;
  roleType = RoleType;

  constructor(
    private dashboardService: DashboardService,
    private dateTimeService: DateTimeService,
    private authService: AuthService) { }

  canDisplay(): boolean {
    return this.dashboard && this.loading === false && this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.loading = true;

    const endDate = new Date();
    const startDate = this.dateTimeService.addDays(new Date(), -7);

    this.startDateDisplay = this.dateTimeService.getDateString(startDate, "MMMM Do YYYY");
    this.endDateDisplay = this.dateTimeService.getDateString(endDate, "MMMM Do YYYY");

    this.dashboardService.getDetails(startDate, endDate)
      .subscribe((dashboard: Dashboard) => {
        this.dashboard = dashboard;
      },
      (error) => {
        this.errors.push({ severity: "error", summary: "Dashboard Error", detail: this.getErrorMessage(error) });
      },
      () => {
        this.loading = false;
      });
  }

  getErrorMessage(error: any): string {
    let displayError = "";
    if (error.message) {
      displayError = error.message;
    } else {
      displayError = error;
    }

    return displayError;
  }
}
