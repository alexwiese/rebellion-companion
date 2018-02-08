import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { AssetService } from "../services/asset.service";
import { BaseComponent } from "../shared/base.component";
import { Asset } from "../models/assets/asset";
import { ModelSummary } from "../models/models/model-summary";
import {
    Panel,
    InputText,
    Button,
    Message,
    Messages,
    InputTextarea,
} from "primeng/primeng";

import * as moment from "moment";

@Component({
    selector: "aed-asset-detail-view",
    templateUrl: "asset-detail-view.component.html",
    styles: [`
    .asset-container
    {
        border: gray 1px solid;
        padding: 10px;
        margin-bottom: 10px;
    }`]
})

export class AssetDetailViewComponent extends BaseComponent implements OnInit {
    asset: Asset;

    constructor(private assetService: AssetService,
        private activatedRoute: ActivatedRoute,
        protected location: Location) {
            super(location);
        }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.assetService.getAsset(id).subscribe((asset) => {
            this.asset = asset;
        },
            error => this.errors.push({ severity: "error", summary: "Asset Error", detail: error }),
            () => {
                this.loading = false;
            }
        );
    }

    hasLongLat() {
        return this.asset.longitude && this.asset.latitude;
    }

    openMapUrl() {
        return "http://maps.google.com/maps?q=loc:" + this.asset.latitude + "," + this.asset.longitude + "&z=17";
    }

    openMap() {
        window.open(this.openMapUrl(), "_blank");
    }
}
