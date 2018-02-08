import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PersonComplianceItemHeld } from "../models/compliance/compliance-detail";
import { ComplianceItemService } from "../services/compliance.service";
import { PagerComponent } from "app/shared/pager.component";

import * as _ from "underscore";

@Component({
    selector: "aed-person-compliance-item-list",
    templateUrl: "./person-compliance-item-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class PersonComplianceItemListComponent extends PagerComponent<PersonComplianceItemHeld> implements OnInit {

    @Input() personId = "";

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
        this.complianceItemService.getPersonComplianceItems(this.personId).subscribe(
            (items: PersonComplianceItemHeld[]) => {
                this.setItems(items);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Person Compliance Items Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
                this.loaded = false;
            }
        );
    }

    onSelect(item: PersonComplianceItemHeld) {
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
