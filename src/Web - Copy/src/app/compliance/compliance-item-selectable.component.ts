import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ComplianceItemDetail } from "../models/compliance/compliance-detail";
import { ComplianceItemService } from "../services/compliance.service";
import { BaseComponent } from "../shared/base.component";
import {
    Dropdown,
    AutoComplete
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-compliance-item-selectable",
    templateUrl: "compliance-item-selectable.component.html",
    styles: [`.label { padding: 10px; margin-right: 10px; cursor: pointer; }`]
})

export class ComplianceItemSelectableComponent extends BaseComponent implements OnInit {
    filteredComplianceItems: ComplianceItemDetail[] = [];

    @Input() siteComplianceItems: ComplianceItemDetail[] = [];
    @Input() selectedComplianceItems: ComplianceItemDetail[] = [];

    @Output() onComplianceItemDetailSelected: EventEmitter<ComplianceItemDetail>
        = new EventEmitter<ComplianceItemDetail>();
    @Output() onComplianceItemDetailUnselected: EventEmitter<ComplianceItemDetail>
        = new EventEmitter<ComplianceItemDetail>();

    constructor(
        private complianceItemService: ComplianceItemService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        protected location: Location) {
            super(location);
    }

    ngOnInit() {
        this.loading = false;
    }

    filterComplianceItems(event: any) {
        this.filteredComplianceItems = [];
        for (let i = 0; i < this.siteComplianceItems.length; i++) {
            const item = this.siteComplianceItems[i];
            if (item.name.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
                this.filteredComplianceItems.push(item);
            }
        }
    }

    handleDropdownClick(event: any) {
        this.filteredComplianceItems = [];

        setTimeout(() => {
            this.filteredComplianceItems = this.siteComplianceItems;
        }, 100);
    }

    selectComplianceItem(event: any): void {
        this.onComplianceItemDetailSelected.emit(event);
    }

    unselectComplianceItem(event: any): void {
        this.onComplianceItemDetailUnselected.emit(event);
    }
}
