import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BusinessDetail } from "app/models/business/business-detail";
import { BusinessService } from "app/services/business.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { ObjectState } from "app/models/base-model";
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
    selector: "aed-business-detail",
    templateUrl: "business-detail.component.html",
    styles: [`.validation-error {
        padding: 0;
    }
    .aedile-select {
        width: 50%;
    }
    .address-container
    {
        border: gray 1px solid;
        padding: 10px;
        margin-bottom: 10px;
    }
    `]
})

export class BusinessDetailComponent extends BaseComponent implements OnInit {
    business: BusinessDetail;
    businessForm: FormGroup;
    submitted = false;

    constructor(
        private authService: AuthService,
        private businessService: BusinessService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;
        const id = this.activatedRoute.snapshot.params["id"];

        this.businessService.getBusiness(id).finally(() => {
            this.loading = false;
        }).subscribe((business) => {
            this.loaded = true;
            this.loading = false;
            this.business = business;
            this.buildForm();
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Business Error", detail: error });
        });
    }

    buildForm(): void {
        if (this.business) {
            this.businessForm = this.fb.group({
                "id": [this.business.id || ""],
                "identity": [this.business.identity || ""],
                "name": [this.business.name || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "tradingName": [this.business.tradingName || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "businessType": [this.business.businessType || "", Validators.required],
                "abn": [this.business.abn || "", Validators.compose([Validators.required,
                Validators.maxLength(11), Validators.minLength(11), ValidatorService.abnValidator])],
                "phone": [this.business.phone || "", Validators.compose([Validators.required])],
                "businessRole": [this.business.businessRole || "", Validators.required],
                "industry": [this.business.industryType, Validators.required],
                "streetAddressId": [this.business.streetAddressId || ""],
                "streetAddressStreet": [this.business.streetAddressStreet || "",
                Validators.compose([Validators.required, Validators.maxLength(100)])],
                "streetAddressSuburb": [this.business.streetAddressSuburb || "",
                Validators.compose([Validators.required, Validators.maxLength(100)])],
                "streetAddressPostcode": [this.business.streetAddressPostCode || "",
                Validators.compose([Validators.required, Validators.maxLength(4)])],
                "streetAddressRegion": [this.business.streetAddressRegion, Validators.required],
                "streetAddressCountry": [this.business.streetAddressCountry, Validators.required],
                "mailAddressId": [this.business.mailAddressId || ""],
                "mailAddressStreet": [this.business.mailAddressStreet || "",
                Validators.compose([Validators.required, Validators.maxLength(100)])],
                "mailAddressSuburb": [this.business.mailAddressSuburb || "",
                Validators.compose([Validators.required, Validators.maxLength(100)])],
                "mailAddressPostcode": [this.business.mailAddressPostCode || "",
                Validators.compose([Validators.required, Validators.maxLength(4)])],
                "mailAddressRegion": [this.business.mailAddressRegion, Validators.required],
                "mailAddressCountry": [this.business.mailAddressCountry, Validators.required]
            });
        }
    }

    onSubmit(value: any): void {
        this.submitted = true;
        if (this.businessForm.valid) {
            this.loading = true;
            this.businessService.saveBusiness(value).subscribe(
                business => this.router.navigate(["businesslist"]),
                error => this.errors.push({ severity: "error", summary: "Business Error", detail: error }),
                this.loading = false
            );
        }
    }

    getAbn(): void {
        if (!environment.production) {
            const abnControl = this.businessForm.controls["abn"];
            this.businessService.getAbn().subscribe(abn =>
                abnControl.setValue(abn, { onlySelf: true }),
                error => this.errors.push({ severity: "error", summary: "Business Error", detail: error }),
                () => {
                    this.loading = false;
                }
            );
        }
    }
}
