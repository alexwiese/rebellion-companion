import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { SiteDetail, SiteFile } from "../models/sites/site-detail";
import { AssetService } from "../services/asset.service";
import { PagerComponent } from "../shared/pager.component";
import { Message } from "primeng/primeng";
import { BaseComponent } from "../shared/base.component";

import * as _ from "underscore";

@Component({
    selector: "aed-site-files",
    templateUrl: "./site-files.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class SiteFilesComponent extends BaseComponent implements OnInit {
    @Input() files: SiteFile[] = [];

    constructor(private assetService: AssetService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {

    }
}
