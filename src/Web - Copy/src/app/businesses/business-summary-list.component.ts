import { RoleType } from "../models/people/person";
import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BusinessSummary } from "../models/business/business-summary";
import { PagerComponent } from "../shared/pager.component";
import { BusinessService } from "../services/business.service";
import { AuthService } from "../services/auth.service";
import { BaseComponent } from "../shared/base.component";
import { DataTable, SharedModule, Button, Message } from "primeng/primeng";

import * as _ from "underscore";

@Component({
    selector: "aed-business-summary-list",
    templateUrl: "./business-summary-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class BusinessSummaryListComponent extends BaseComponent implements OnInit {
    query: string;
    errors: Message[] = [];
    loading = false;
    loaded = false;
    items: BusinessSummary[];
    numberOfItems = 0;

    @Input() siteId = "";

    constructor(private businessService: BusinessService,
        private authService: AuthService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;
        this.search();
    }

    search() {
        this.loading = true;

        this.businessService.getBusinesses().finally(() => {
            this.loading = false;
        }).subscribe((businesses: BusinessSummary[]) => {
            this.items = businesses;
            this.numberOfItems = businesses.length;
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Business Error", detail: error });
            this.numberOfItems = 0;
        });
    }

    editDisabled(businessId: string): boolean {
        if (this.authService.hasPersmission(RoleType.SystemAdministrator)) {
            return false;
        }

        if (this.authService.hasPersmission(RoleType.Maintainer)) {
            return businessId !== this.authService.businessId()
        }

        return true;
    }

    rowClicked(event) {
      this.router.navigate(["business", event.data.id, "view"])
    }
}
