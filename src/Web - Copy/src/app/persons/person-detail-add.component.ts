import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { PersonDetail } from "app/models/people/person";
import { PersonService } from "app/services/person.service";
import { BusinessService } from "app/services/business.service";
import { AuthService } from "app/services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { ValidatorService } from "app/services/validator.service";
import { environment } from "../../environments/environment";
import * as _ from "underscore";
import { PersonDetailComponent } from "app/persons/person-detail-base.component";
import { Panel, InputText, Button, Messages, Dropdown, Checkbox, AutoComplete } from "primeng/primeng";

@Component({
    selector: "aed-person-detail-add",
    templateUrl: "./person-detail-add.component.html",
    styles: []
})
export class PersonDetailAddComponent extends PersonDetailComponent implements OnInit {
    constructor(
        http: Http,
        location: Location,
        authHttp: AuthHttp,
        authService: AuthService,
        personService: PersonService,
        businessService: BusinessService,
        validatorService: ValidatorService,
        router: Router,
        activatedRoute: ActivatedRoute,
        fb: FormBuilder) {
        super(http, authHttp, location, authService, personService, businessService, validatorService, router, activatedRoute, fb);
    }

    ngOnInit() {
        this.loadPageData(this.buildForm.bind(this));
    }

    buildForm(): void {
        if (this.person) {
            this.personForm = this.fb.group({
                "id": [this.person.id || ""],
                "active": [this.person.active || true],
                "firstName": [this.person.firstName || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "lastName": [this.person.lastName || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "userName": [this.person.userName || "", Validators.compose([Validators.required, Validators.maxLength(50)]),
                ValidatorService.nameExists(this.authHttp)],
                "email": [this.person.email || "",
                Validators.compose([Validators.required, Validators.maxLength(100), ValidatorService.emailValidator]),
                ValidatorService.emailExists(this.authHttp)],
                "phoneNumber": [this.person.phoneNumber || "",
                Validators.compose([Validators.required, Validators.maxLength(50), ValidatorService.phoneValidator])],
                "business": [this.person.businessId || "", Validators.required],
                "role": [this.person.role || "", Validators.required],
                "password": [this.person.password || "", Validators.compose([Validators.required, Validators.maxLength(50),
                Validators.minLength(8), ValidatorService.passwordValidator])],
                "isPlanner": [this.person.isPlanner || ""],
                "isScheduler": [this.person.isScheduler || ""],
                "isAssetAuditor": [this.person.isAssetAuditor || ""],
                "isTechnician": [this.person.isTechnician || ""]
            });
        }
    }

    onSubmit(value: any): void {
        this.loading = true;
        this.errors = [];

        if (this.personForm.valid) {
            this.updatePersonFromFormValues(value);

            this.personService.save(this.person).subscribe(
                business => this.router.navigate(["peoplelist"]),
                error => this.errors.push({ severity: "error", summary: "Person Error", detail: error }),
                this.loading = false
            );
        }

        this.submitted = true;
    }

    private updatePersonFromFormValues(value: any): void {
        this.person.id = value.id;
        this.person.active = value.active;
        this.person.businessId = value.business;
        this.person.createdDate = new Date();
        this.person.firstName = value.firstName;
        this.person.lastName = value.lastName;
        this.person.userName = value.userName;
        this.person.email = value.email;
        this.person.phoneNumber = value.phoneNumber;
        this.person.role = value.role;
        this.person.password = value.password;
        this.person.isPlanner = value.isPlanner || false;
        this.person.isScheduler = value.isScheduler || false;
        this.person.isAssetAuditor = value.isAssetAuditor || false;
        this.person.isTechnician = value.isTechnician || false;
    }
}

