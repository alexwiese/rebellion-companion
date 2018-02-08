import { Observable } from "rxjs/Rx";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { PersonComplianceItemHeld, ComplianceItemType } from "app/models/compliance/compliance-detail";
import { RoleType } from "app/models/people/person";
import { ComplianceItemService } from "app/services/compliance.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";
import "rxjs/add/operator/mergeMap";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  SelectItem
} from "primeng/primeng";

import * as _ from "underscore";

@Component({
  selector: "aed-person-compliance-item-detail",
  templateUrl: "./person-compliance-item-detail.component.html",
  styles: []
})
export class PersonComplianceItemDetailComponent extends BaseComponent implements OnInit {
  personId: string;
  personComplianceItemId: string;
  personComplianceItemForm: FormGroup;
  personComplianceItem: PersonComplianceItemHeld = null;
  protected complianceItems: SelectItem[] = [];
  uploadFilesUrl = "";
  uploadingFile = false;
  isVerifiedDisabled = true;

  constructor(
    private http: Http,
    private authService: AuthService,
    private complianceItemService: ComplianceItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loadPageData();
    this.uploadFilesUrl = this.complianceItemService.personComplianceItemHeldFileUploadUrl;
  }

  showFileUpload(): boolean {
    return !this.complianceItemService.isNewObject(this.personComplianceItem);
  }

  loadPageData() {
    this.loading = true;
    this.personId = this.activatedRoute.snapshot.params["personId"];
    this.personComplianceItemId = this.activatedRoute.snapshot.params["id"];

    this.getComplianceItem().flatMap((complianceItem) => {
      this.personComplianceItem = complianceItem;
      this.isVerifiedDisabled = this.personComplianceItem.isVerified === true && !this.isEmptyGuid(this.personComplianceItem.id);
      return this.complianceItemService.getComplianceItemsWithPersonTypes();
    }).finally(() => {
      this.loading = false;
      this.loaded = true;
    }).subscribe((complianceItems) => {
      complianceItems.forEach((s) => {
        this.complianceItems.push({ label: s.name, value: s.id });
      });

      this.setDefaultObject(this.complianceItems);

      this.buildForm();
    }, (error) => {
      this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error });
    });
  }

  displayVerified() {
    return this.authService.hasPersmission(RoleType.Maintainer);
  }

  getComplianceItem(): Observable<PersonComplianceItemHeld> {
    if (this.personComplianceItemId) {
      return this.complianceItemService.getPersonComplianceItem(this.personComplianceItemId);
    } else {
      return Observable.of(new PersonComplianceItemHeld("", new Date(), true, "", "", this.personId,
        "", new Date(), new Date(), false, ComplianceItemType.License, ""));
    }
  }

  buildForm(): void {
    if (this.personComplianceItem) {
      this.personComplianceItemForm = this.fb.group({
        "id": [this.personComplianceItem.id || this.getEmptyGuid() || Validators.required],
        "complianceItemId": [this.personComplianceItem.complianceItemId || "", Validators.required],
        "personId": [this.personComplianceItem.personId || "", Validators.required],
        "active": [this.personComplianceItem.active || true],
        "reference": [this.personComplianceItem.reference || "", [Validators.required, Validators.maxLength(100)]],
        "startDate": [this.personComplianceItem.startDate || new Date(), Validators.required],
        "expiryDate": [this.personComplianceItem.expiryDate || new Date(), Validators.required],
        "isVerified": [this.personComplianceItem.isVerified, Validators.required]
      });
    }
  }

  onSubmit(value: any): void {
    this.complianceItemService.savePersonComplianceItemHeld(value).subscribe(
      item => this.location.back(),
      error => this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error }),
      () => {
        this.loading = false;
      }
    );
  }

  onBeforeSend(event) {
    this.uploadingFile = true;

    const personComplianceItem = {
      id: this.personComplianceItem.id,
      fileName: "",
      fileSource: ""
    }

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService.getAuth().access_token}`);
    event.formData.set("fileDetails", JSON.stringify(personComplianceItem));
  }

  onUploadError(event) {
    this.uploadingFile = false;
    const message = JSON.parse(event.xhr.responseText).Message;
    this.errors.push({ severity: "error", summary: "Compliance Item File Error", detail: message });
    this.scrollToTop();
  }

  onUploadFiles(event) {
    this.uploadingFile = false;
    this.loadPageData();
  }
}
