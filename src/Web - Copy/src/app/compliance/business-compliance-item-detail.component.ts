import { Observable } from "rxjs/Rx";
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { BusinessComplianceItemHeld, ComplianceItemType } from "app/models/compliance/compliance-detail";
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
  selector: "aed-business-compliance-item-detail",
  templateUrl: "./business-compliance-item-detail.component.html",
  styles: []
})
export class BusinessComplianceItemDetailComponent extends BaseComponent implements OnInit {
  businessId: string;
  businessComplianceItemId: string;
  businessComplianceItemForm: FormGroup;
  businessComplianceItem: BusinessComplianceItemHeld = null;
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
    this.uploadFilesUrl = this.complianceItemService.businessComplianceItemHeldFileUploadUrl;
  }

  showFileUpload(): boolean {
    return !this.complianceItemService.isNewObject(this.businessComplianceItem);
  }

  loadPageData() {
    this.loading = true;
    this.businessId = this.activatedRoute.snapshot.params["businessId"];
    this.businessComplianceItemId = this.activatedRoute.snapshot.params["id"];

    this.getComplianceItem().flatMap((complianceItem) => {
      this.businessComplianceItem = complianceItem;
      this.isVerifiedDisabled = this.businessComplianceItem.isVerified === true && !this.isEmptyGuid(this.businessComplianceItem.id);
      return this.complianceItemService.getComplianceItemsWithBusinessTypes();
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

  getComplianceItem(): Observable<BusinessComplianceItemHeld> {
    if (this.businessComplianceItemId) {
      return this.complianceItemService.getBusinessComplianceItem(this.businessComplianceItemId);
    } else {
      return Observable.of(new BusinessComplianceItemHeld("", new Date(), true, "", "", this.businessId,
        "", new Date(), new Date(), false, ComplianceItemType.License, ""));
    }
  }

  buildForm(): void {
    if (this.businessComplianceItem) {
      this.businessComplianceItemForm = this.fb.group({
        "id": [this.businessComplianceItem.id || this.getEmptyGuid() || Validators.required],
        "complianceItemId": [this.businessComplianceItem.complianceItemId || "", Validators.required],
        "businessId": [this.businessComplianceItem.businessId || "", Validators.required],
        "active": [this.businessComplianceItem.active || true],
        "reference": [this.businessComplianceItem.reference || "", [Validators.required, Validators.maxLength(100)]],
        "startDate": [this.businessComplianceItem.startDate || new Date(), Validators.required],
        "expiryDate": [this.businessComplianceItem.expiryDate || new Date(), Validators.required],
        "isVerified": [this.businessComplianceItem.isVerified, Validators.required]
      });
    }
  }

  onSubmit(value: any): void {
    this.complianceItemService.saveBusinessComplianceItemHeld(value).subscribe(
      item => this.location.back(),
      error => this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error }),
      () => {
        this.loading = false;
      }
    );
  }

  private showExceptionIfBusinessIdMissing() {
    if (!this.businessId) {
      this.errors.push({
        severity: "error", summary: "Compliance Item Error",
        detail: "No business id has been been provided. Cannot create compliance items without an associated business"
      });
    }
  }

  onBeforeSend(event) {
    this.uploadingFile = true;

    const businessComplianceItem = {
      id: this.businessComplianceItem.id,
      fileName: "",
      fileSource: ""
    }

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService.getAuth().access_token}`);
    event.formData.set("fileDetails", JSON.stringify(businessComplianceItem));
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
