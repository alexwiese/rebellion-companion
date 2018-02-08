import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ManufacturerDetail } from "app/models/models/manufacturer-summary";
import { ModelService } from "app/services/model.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import {
    Panel,
    InputText,
    Button,
    Message,
    Dropdown,
} from "primeng/primeng";
import { environment } from "environments/environment";

@Component({
    selector: "aed-manufacturer-detail",
    templateUrl: "manufacturer-detail.component.html",
    styles: []
})

export class ManufacturerDetailComponent extends BaseComponent implements OnInit {
    manufacturer: ManufacturerDetail;
    manufacturerForm: FormGroup;
    submitted = false;

    constructor(
        private authService: AuthService,
        private modelService: ModelService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.modelService.getManufacturer(id).finally(() => {
            this.loading = false;
            this.loaded = true;
        }).subscribe((manufacturer) => {
            this.manufacturer = manufacturer;
            this.buildForm();
        },
            (error) => {
                this.errors.push({ severity: "error", summary: "Manufacturer Load Error", detail: error });
            }
            );
    }

    buildForm(): void {
        if (this.manufacturer) {
            this.manufacturerForm = this.fb.group({
                "id": [this.manufacturer.id || ""],
                "createdDate": [this.manufacturer.createdDate || new Date(), Validators.required],
                "name": [this.manufacturer.name || "",
                    [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
                "active": [this.manufacturer.active || 1],
                "canDelete": [this.manufacturer.canDelete || 0],
                "models": [this.manufacturer.models || []]
            });
        }
    }

    onSubmit(value: any): void {
        this.submitted = true;
        if (this.manufacturerForm.valid) {
            this.loading = true;
            this.modelService.save(value).subscribe(
                business => this.router.navigate(["manufacturerlist"]),
                error => this.errors.push({ severity: "error", summary: "Manufacturer Save Error", detail: error }),
                this.loading = false
            );
        }
    }
}
