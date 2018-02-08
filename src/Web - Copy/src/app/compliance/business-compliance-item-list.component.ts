import { BusinessComplianceItemDetailComponent } from "./business-compliance-item-detail.component";
import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BusinessComplianceItemHeld } from "../models/compliance/compliance-detail";
import { ComplianceItemService } from "../services/compliance.service";
import { PagerComponent } from "app/shared/pager.component";

import * as _ from "underscore";

@Component({
    selector: "aed-business-compliance-item-list",
    templateUrl: "./business-compliance-item-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class BusinessComplianceItemListComponent extends PagerComponent<BusinessComplianceItemHeld> implements OnInit {

    @Input() businessId = "";
    @Input() showCancelButton = true;

    constructor(private complianceItemService: ComplianceItemService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.searchItems();
    }

    searchItems() {
        this.loading = true;
        this.complianceItemService.getBusinessComplianceItems(this.businessId).subscribe(
            (items: BusinessComplianceItemHeld[]) => {
                this.setItems(items);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Business Compliance Items Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
                this.loaded = false;
            }
        );
    }

    onSelect(item: BusinessComplianceItemHeld) {
        this.selectedItem = item;
    }

    highlightRow(rowData: any, rowIndex: number) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const expiryDate = rowData.expiryDate;
        expiryDate.setHours(0, 0, 0, 0);

        return expiryDate < now ? "hasExpired" : "";
    }
}
