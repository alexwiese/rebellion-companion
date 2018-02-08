import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { SiteObjectSummary } from "app/models/siteobjects/siteobject-summary";
import { SiteObjectType } from "app/models/siteobjects/siteobject-detail";
import { SiteDetail } from "app/models/sites/site-detail";
import { SiteObjectService } from "app/services/siteobject.service";
import { PagerComponent } from "app/shared/pager.component";

import * as _ from "underscore";

@Component({
    selector: "aed-siteobject-summary-list",
    templateUrl: "./siteobject-summary-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class SiteObjectSummaryListComponent extends PagerComponent<SiteObjectSummary> implements OnInit {
    query: string;
    showTable = true;
    addButtonText = "Add";

    @Input() labelText: string;
    @Input() siteId: string;
    @Input() businessId: string;
    @Input() siteObjects: SiteObjectSummary[];

    constructor(private siteObjectService: SiteObjectService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        if (!this.labelText || this.labelText.length === 0) {
            this.labelText = "Site Object";
        }

        this.setAddButtonText();

        if (this.siteObjects) {
            this.setItems(this.siteObjects);
            this.loading = false;
        } else {
            this.search();
        }
    }

    search() {
        this.loading = true;

        this.siteObjectService.filterSiteObjects(this.siteId).subscribe(
            (siteObjects: SiteObjectSummary[]) => {
                this.setItems(siteObjects);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Site Object Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
            }
        );
    }

    setHeader(text: string) {
        return `${this.labelText} ${text}`;
    }

    setAddButtonText() {
        this.addButtonText = `Add ${this.labelText}`;
    }

    navigateToAddSiteObject() {
        this.router.navigate(["siteobject/add", this.siteId, this.getSiteObjectTypeFromLabel(this.labelText)]);
    }

    getSiteObjectTypeFromLabel(text: string) {
        switch (text) {
            case "Building": return SiteObjectType.Building;
            case "Ground": return SiteObjectType.Grounds;
            case "Infrastructure": return SiteObjectType.Infrastructure;
            default: return SiteObjectType.Building;
          }
    }
}
