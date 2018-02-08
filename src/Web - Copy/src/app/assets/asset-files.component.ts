import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Asset, AssetSummary, AssetFile } from "../models/assets/asset";
import { AssetService } from "../services/asset.service";
import { PagerComponent } from "../shared/pager.component";
import { Message } from "primeng/primeng";
import { BaseComponent } from "../shared/base.component";

import * as _ from "underscore";

@Component({
    selector: "aed-asset-files",
    templateUrl: "./asset-files.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class AssetFilesComponent extends BaseComponent implements OnInit {
    @Input() assetId = "";
    files: AssetFile[] = [];

    constructor(private assetService: AssetService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.getAssetFiles();
    }

    getAssetFiles() {
        this.loading = true;
        this.errors = [];

        this.assetService.getFiles(this.assetId)
            .subscribe(
            (files: AssetFile[]) => {
                this.files = files;
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Asset Files Error", detail: error });
            },
            () => {
                this.loading = false;
            });
    }
}
