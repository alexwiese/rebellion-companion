import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Dashboard } from "../models/dashboard/dashboard";
import { AuthHttp } from "./auth.http";
import { BaseService } from "../services/base.service";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class DashboardService extends BaseService {
  constructor(public http: AuthHttp, authService: AuthService, router: Router) {
    super(authService, router);
  }

  // calls the [GET] /api/dashboard?startDate=2017-02-01T16:00:00+hh:mm:ss&endDate=2017-02-05T16:00:00+hh:mm:ss
  getDetails(startDate: Date, endDate: Date) {
    const url =
      "api/dashboard?startDate=" +
      startDate.toISOString() +
      "&endDate=" +
      endDate.toISOString();

    return this.http
      .get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }
}
