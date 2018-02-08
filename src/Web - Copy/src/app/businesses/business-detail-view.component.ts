import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleType } from "app/models/people/person";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { BusinessDetail } from "app/models/business/business-detail";
import { BusinessService } from "app/services/business.service";
import { AuthService } from "app/services/auth.service";
import { SiteSummaryListComponent } from "../sites/site-summary-list.component";
import { BaseComponent } from "../shared/base.component";
import { environment } from "../../environments/environment";
import * as _ from "underscore";

@Component({
  selector: "aed-business-detail-view",
  templateUrl: "business-detail-view.component.html",
  styles: []
})
export class BusinessDetailViewComponent extends BaseComponent
  implements OnInit {
  business: BusinessDetail;
  displayActivateButton = true;

  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected location: Location
  ) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    const id = this.activatedRoute.snapshot.params["id"];

    this.businessService
      .getBusiness(id)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        business => {
          this.business = business;
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Business Error",
            detail: error
          });
        }
      );

    if (!this.authService.hasRole(RoleType.SystemAdministrator)) {
      this.displayActivateButton = false;
    }
  }

  editBusiness(): void {
    if (this.business) {
      this.router.navigate(["business/edit", this.business.id]);
    }
  }

  activateBusiness(): void {
    this.loading = true;
    this.business.active = !this.business.active;
    this.businessService
      .saveBusiness(this.business)
      .subscribe(
        business => (this.business = business),
        error =>
          this.errors.push({
            severity: "error",
            summary: "Business Error",
            detail: error
          }),
        (this.loading = false)
      );
  }

  activateLabel(): string {
    if (this.business.active) {
      return "Activate";
    }

    return "Deacivate";
  }

  getActivateButtonBackgroundColor(): string {
    if (this.business.active) {
      return "green";
    } else {
      return "red";
    }
  }
}
