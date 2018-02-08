import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseComponent } from "app/shared/base.component";
import { WorkOrderAsset, VerificationStatusType } from "app/models/assets/asset";
import * as _ from "underscore";

import {
    Panel,
    InputText,
    Button,
    Message,
    Messages,
    InputTextarea,
} from "primeng/primeng";


@Component({
    selector: "aed-workorderassets-totals",
    templateUrl: "workorderassets-totals.component.html"
})

export class WorkOrderAssetsTotalsComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() workOrderAssets: WorkOrderAsset[] = [];

    totalCount = 0;
    foundCount = 0;
    notFoundCount = 0;
    newCount = 0;

    constructor(private activatedRoute: ActivatedRoute,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.getCounts();
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        this.workOrderAssets = changes.workOrderAssets.currentValue;
        this.getCounts();
    }

    private getCounts() {
        this.totalCount = this.workOrderAssets.length || 0;

        this.foundCount = _.filter(this.workOrderAssets, (a) => {
            return a.verificationStatus === VerificationStatusType.Found;
        }).length || 0;

        this.notFoundCount = _.filter(this.workOrderAssets, (a) => {
            return a.verificationStatus === VerificationStatusType.NotFound;
        }).length || 0;

        this.newCount = _.filter(this.workOrderAssets, (a) => {
            return a.verificationStatus === VerificationStatusType.New;
        }).length || 0;
    }
}
