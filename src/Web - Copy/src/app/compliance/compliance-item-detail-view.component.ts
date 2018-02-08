import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ComplianceItemDetail } from "../models/compliance/compliance-detail";
import { ComplianceItemService } from "../services/compliance.service";
import { BaseComponent } from "../shared/base.component";
import {
    Panel,
    InputText,
    Button,
    Message,
    Messages
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-compliance-item-detail-view",
    templateUrl: "compliance-item-detail-view.component.html",
    styles: []
})

export class ComplianceItemDetailViewComponent extends BaseComponent implements OnInit {
    complianceItem: ComplianceItemDetail;

    constructor(
        private complianceItemService: ComplianceItemService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        protected location: Location) {
            super(location);
    }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.complianceItemService.getComplianceItem(id).subscribe(
            item => this.complianceItem = <ComplianceItemDetail>item,
            error => this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error }),
            () => {
                this.loading = false;
            }
        );
    }

    gotBack(): void {
        this.location.back();
    }
}
