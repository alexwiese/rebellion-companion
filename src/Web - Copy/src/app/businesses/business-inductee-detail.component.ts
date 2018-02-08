import { InducteeService } from "../services/inductee.service";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { BusinessInducteeDetail } from "app/models/inductees/inductee";
import { BusinessDetail } from "app/models/business/business-detail";
import { PersonDetail } from "app/models/people/person";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BusinessService } from "app/services/business.service";
import { PersonService } from "app/services/person.service";
import { ObjectState } from "app/models/base-model";
import { BaseComponent } from "../shared/base.component";
import { Panel, InputText, Button, Message, Dropdown } from "primeng/primeng";
import "rxjs/add/operator/mergeMap";
import { environment } from "environments/environment";

@Component({
  selector: "aed-business-inductee-detail",
  templateUrl: "business-inductee-detail.component.html",
  styles: [`.validation-error { padding: 0; }`]
})
export class BusinessInducteeDetailComponent extends BaseComponent
  implements OnInit {
  businessInductee: BusinessInducteeDetail;
  business: BusinessDetail;
  person: PersonDetail;
  businessInducteeForm: FormGroup;
  submitted = false;
  personName = "";
  businessName = "";
  uploadingFile = false;
  uploadFilesUrl = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location,
    private businessService: BusinessService,
    private personService: PersonService,
    private inducteeService: InducteeService
  ) {
    super(location);
  }

  ngOnInit() {
    this.loadPageData();
  }

  loadPageData() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.params["id"];
    const personId = this.activatedRoute.snapshot.params["personId"];
    const businessId = this.activatedRoute.snapshot.params["businessId"];

    this.uploadFilesUrl = this.inducteeService.inducteeFileUploadUrl;

    if (id) {
      this.getInductee(id);
    } else {
      this.createNewInductee(businessId, personId);
    }
  }

  getInductee(id) {
    this.inducteeService
      .getBusinessInductee(id)
      .finally(() => {
        this.loaded = true;
        this.loading = false;
      })
      .subscribe(
        inductee => {
          this.businessInductee = inductee;
          this.personName = inductee.personName;
          this.businessName = inductee.businessName;
          this.buildForm();
          this.loaded = true;
          this.loading = false;
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Business Inductee Error",
            detail: error
          });
        }
      );
  }

  createNewInductee(businessId, personId) {
    this.businessService
      .getBusiness(businessId)
      .finally(() => {
        this.loading = false;
      })
      .flatMap(business => {
        this.business = business;
        this.businessName = this.business.name;
        return this.personService.getSummary(personId);
      })
      .subscribe(
        person => {
          this.person = person;
          this.personName = this.person.fullName;

          this.businessInductee = new BusinessInducteeDetail(
            "",
            new Date(),
            true,
            this.business.id,
            this.business.name,
            this.person.id,
            this.person.fullName,
            new Date(),
            new Date(),
            ""
          );

          this.buildForm();

          this.loaded = true;
          this.loading = false;
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Business Inductee Error",
            detail: error
          });
        }
      );
  }

  buildForm(): void {
    if (this.businessInductee) {
      this.businessInducteeForm = this.fb.group({
        id: [this.businessInductee.id || ""],
        personId: [this.businessInductee.personId, Validators.required],
        businessId: [this.businessInductee.businessId, Validators.required],
        inductedDate: [
          this.businessInductee.inductedDate || new Date(),
          Validators.required
        ],
        expiryDate: [
          this.businessInductee.expiryDate || new Date(),
          Validators.required
        ]
      });
    }
  }

  onSubmit(value: any): void {
    this.submitted = true;
    if (this.businessInducteeForm.valid) {
      this.loading = true;
      this.inducteeService.saveInductee(value).subscribe(
        business => this.goBack(),
        error =>
          this.errors.push({
            severity: "error",
            summary: "Business Inductee Error",
            detail: error
          }),
        () => {
          this.loading = false;
        }
      );
    }
  }

  showFileUpload(): boolean {
    return !this.inducteeService.isNewObject(this.businessInductee);
  }

  onBeforeSend(event) {
    this.uploadingFile = true;

    const inductee = {
      id: this.businessInductee.id,
      fileName: "",
      fileSource: ""
    };

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader(
      "Authorization",
      `Bearer ${this.authService.getAuth().access_token}`
    );
    event.formData.set("fileDetails", JSON.stringify(inductee));
  }

  onUploadError(event) {
    this.uploadingFile = false;
    const message = JSON.parse(event.xhr.responseText).Message;
    this.errors.push({
      severity: "error",
      summary: "Compliance Item File Error",
      detail: message
    });
    this.scrollToTop();
  }

  onUploadFiles(event) {
    this.uploadingFile = false;
    this.loadPageData();
  }
}
