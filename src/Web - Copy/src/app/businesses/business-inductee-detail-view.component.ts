import { InducteeService } from "../services/inductee.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BusinessInducteeDetail } from "app/models/inductees/inductee";
import { BusinessDetail } from "app/models/business/business-detail";
import { PersonDetail } from "app/models/people/person";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BusinessService } from "app/services/business.service";
import { PersonService } from "app/services/person.service";
import { ObjectState } from "app/models/base-model";
import { BaseComponent } from "../shared/base.component";
import {
    Panel,
    InputText,
    Button,
    Message,
    Dropdown,
} from "primeng/primeng";
import "rxjs/add/operator/mergeMap";
import { environment } from "environments/environment";

@Component({
    selector: "aed-business-inductee-detail-view",
    templateUrl: "business-inductee-detail-view.component.html",
    styles: [`.validation-error { padding: 0; }`]
})

export class BusinessInducteeDetailViewComponent extends BaseComponent implements OnInit {
    businessInductee: BusinessInducteeDetail;

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        protected location: Location,
        private inducteeService: InducteeService) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;
        const id = this.activatedRoute.snapshot.params["id"];

        this.inducteeService.getBusinessInductee(id).finally(() => {
            this.loading = false;
        }).subscribe((businessInductee) => {
            this.businessInductee = businessInductee;
            this.loaded = true;
            this.loading = false;
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Business Inductee Error", detail: error });
        });
    }
}
