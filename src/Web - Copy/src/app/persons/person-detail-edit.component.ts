import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { PersonDetail } from "app/models/people/person";
import { PersonService } from "app/services/person.service";
import { AuthService } from "app/services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { BusinessService } from "app/services/business.service";
import { ValidatorService } from "app/services/validator.service";

import { Panel, InputText, Button, Messages } from "primeng/primeng";

import { environment } from "../../environments/environment";
import * as _ from "underscore";
import { PersonDetailComponent } from "app/persons/person-detail-base.component";


@Component({
    selector: "aed-person-detail-edit",
    templateUrl: "./person-detail-edit.component.html",
    styles: []
})
export class PersonDetailEditComponent extends PersonDetailComponent implements OnInit {

    uploadFilesUrl = "";
    uploadingFile = false;

    constructor(
        http: Http,
        authHttp: AuthHttp,
        location: Location,
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
        this.uploadFilesUrl = this.personService.fileUploadUrl();
    }

    buildForm(): void {
        if (this.person) {
            this.personForm = this.fb.group({
                "firstName": [this.person.firstName || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "lastName": [this.person.lastName || "", Validators.compose([Validators.required, Validators.maxLength(50)])],
                "email": [this.person.email || "",
                Validators.compose([Validators.required, Validators.maxLength(100), ValidatorService.emailValidator]),
                ValidatorService.emailExists(this.authHttp, this.person.id)],
                "phoneNumber": [this.person.phoneNumber || "",
                Validators.compose([Validators.required, Validators.maxLength(50), ValidatorService.phoneValidator])],
                "password": [this.person.password || "", Validators.compose([Validators.minLength(8), Validators.maxLength(50),
                ValidatorService.passwordValidator])]
            });
        }
    }

    onSubmit(value: any): void {
        this.submitted = true;

        if (this.personForm.valid) {

            this.loading = true;
            this.person.firstName = value.firstName;
            this.person.lastName = value.lastName;
            this.person.email = value.email;
            this.person.phoneNumber = value.phoneNumber;
            this.person.password = value.password;

            this.personService.save(this.person).subscribe(
                business => this.router.navigate(["peoplelist"]),
                error => this.errors.push({ severity: "error", summary: "Person Error", detail: error }),
                this.loading = false
            );
        }

        this.submitted = true;
    }

    onBeforeSend(event) {
        this.uploadingFile = true;

        const person = {
            id: this.person.id,
            fileName: "",
            fileSource: ""
        }

        event.xhr.open("post", this.uploadFilesUrl, true);
        event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService.getAuth().access_token}`);
        event.formData.set("fileDetails", JSON.stringify(person));
    }

    onUploadError(event) {
        this.uploadingFile = false;
        const message = JSON.parse(event.xhr.responseText).Message;
        this.errors.push({ severity: "error", summary: "Person File Error", detail: message });
        this.scrollToTop();
    }

    onUploadFiles(event) {
        this.uploadingFile = false;
        this.loadPageData(this.buildForm.bind(this));
    }
}
