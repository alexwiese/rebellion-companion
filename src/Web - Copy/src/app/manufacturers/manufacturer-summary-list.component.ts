import { Component, OnInit, Input } from "@angular/core";
import { Location } from "@angular/common";
import { BaseComponent } from "app/shared/base.component";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ModelService } from "app/services/model.service";
import { ManufacturerDetail } from "app/models/models/manufacturer-summary";
import { TreeTableModule, TreeNode, SharedModule, Message, Messages, DialogModule } from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-manufacturer-summary-list",
    templateUrl: "manufacturer-summary-list.component.html",
    styles: []
})

export class ManufacturerSummaryListComponent extends BaseComponent implements OnInit {
    query: string;
    errors: Message[] = [];
    loading = false;
    loaded = false;
    items: ManufacturerDetail[];
    numberOfItems = 0;

    @Input() siteId = "";

    constructor(private modelService: ModelService,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;
        this.search();
    }

    search() {
        this.loading = true;
        this.loadManufacturers();
    }

    loadManufacturers() {
        this.modelService.getManufacturers().subscribe(
            (manufacturers: ManufacturerDetail[]) => {
                this.items = manufacturers;
                this.numberOfItems = manufacturers.length;
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Manufacturer Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
            }
        );
    }

    deleteManufacturer(id: any) {
        if (!id) {
            this.errors = [];
            this.errors.push({ severity: "error", summary: "Delete Manufacturer Error", detail: "No id was provided" });
            return;
        }

        this.loading = true;
        this.modelService.delete(id).subscribe(
            (item) => {
                if (item) {
                    this.loadManufacturers();
                }
            },
            error => this.errors.push({ severity: "error", summary: "Delete Manufacturer Error", detail: error }),
            this.loading = false
        );
    }
}
