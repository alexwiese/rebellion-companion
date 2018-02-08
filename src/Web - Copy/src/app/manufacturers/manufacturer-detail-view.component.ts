import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../shared/base.component";
import { ManufacturerDetail } from "app/models/models/manufacturer-summary";
import { ModelService } from "app/services/model.service";
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
    selector: "aed-manufacturer-detail-view",
    templateUrl: "manufacturer-detail-view.component.html",
    styles: []
})

export class ManufacturerDetailViewComponent extends BaseComponent implements OnInit {
    manufacturer: ManufacturerDetail;

    constructor(private modelService: ModelService,
        private activatedRoute: ActivatedRoute,
        protected location: Location) {
            super(location);
        }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.modelService.getManufacturer(id).subscribe((manufacturer) => {
            this.manufacturer = manufacturer;
        },
            error => this.errors.push({ severity: "error", summary: "Manufacturer Error", detail: error }),
            () => {
                this.loading = false;
            }
        );
    }
}
