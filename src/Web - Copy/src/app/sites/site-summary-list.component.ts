import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { SiteSummary } from "../models/sites/site-summary";
import { SiteService } from "../services/site.service";
import { DataTable, SharedModule, Button } from "primeng/primeng";
import { PagerComponent } from "../shared/pager.component";
import * as _ from "underscore";

@Component({
    selector: "aed-site-summary-list",
    templateUrl: "./site-summary-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class SiteSummaryListComponent extends PagerComponent<SiteSummary> implements OnInit {
    @Input() businessId = "";
    @Input() showViewButtons = false;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private siteService: SiteService,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        this.siteService.getSites(this.businessId).subscribe(
            (sites: SiteSummary[]) => {
                this.setItems(sites);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Business Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
            }
        );
    }
}
