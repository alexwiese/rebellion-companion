import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { SiteDetail, SiteType, SiteFile } from "app/models/sites/site-detail";
import { SiteObjectSummary } from "app/models/siteobjects/siteobject-summary";
import { SiteObjectType } from "app/models/siteobjects/siteobject-detail";
import { BusinessDetail } from "app/models/business/business-detail";
import { ComplianceItemDetail } from "app/models/compliance/compliance-detail";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { BusinessService } from "app/services/business.service";
import { WorkInstructionService } from "app/services/workinstruction.service";
import { AuthService } from "app/services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { ValidatorService } from "app/services/validator.service";
import { ComplianceItemService } from "app/services/compliance.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";

import "rxjs/add/operator/mergeMap";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  AutoComplete,
  SelectItem
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
  selector: "aed-site-detail",
  templateUrl: "./site-detail.component.html",
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
export class SiteDetailComponent extends BaseComponent implements OnInit {

  business: BusinessDetail = null;
  site: SiteDetail;
  siteForm: FormGroup;
  submitted = false;
  businessId: string;
  siteId: string;
  complianceItems: ComplianceItemDetail[] = [];
  buildingSiteObjects: SiteObjectSummary[] = [];
  groundSiteObjects: SiteObjectSummary[] = [];
  infrastructureSiteObjects: SiteObjectSummary[] = [];
  safetyInstructions: SelectItem[] = [];

  // Upload files variables
  uploadFilesUrl = "";
  uploadedFiles: any[] = [];
  fileName = "";
  fileSource = "";
  displayDocumentImages = false;
  documentImagesButtonText = "Show Images";
  fileValidationRequired = false;

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private authService: AuthService,
    private siteService: SiteService,
    private siteObjectService: SiteObjectService,
    private businsessService: BusinessService,
    private workInstructionService: WorkInstructionService,
    private complianceItemService: ComplianceItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    this.businessId = this.activatedRoute.snapshot.params["businessId"];
    this.siteId = this.activatedRoute.snapshot.params["id"];

    this.uploadFilesUrl = this.siteService.fileUploadUrl();

    this.complianceItemService.getComplianceItems().flatMap((complianceItems) => {
      this.complianceItems = complianceItems;
      return this.workInstructionService.getSafetyInstruction();
    }).flatMap((safetyInstructions) => {
      safetyInstructions.forEach((s) => {
        this.safetyInstructions.push({ label: s.name, value: s.id });
      });
      this.setDefaultObject(this.safetyInstructions);
      return this.businsessService.getBusiness(this.businessId)
    }).subscribe((business) => {
      this.business = business;
      if (this.siteId) {
        this.siteService.getSite(this.siteId).subscribe((site) => {
          this.site = site;
          this.siteObjectService.filterSiteObjects(this.siteId).subscribe((siteObjects) => {
            this.buildingSiteObjects = _.filter(siteObjects, item => {
              return item.type === SiteObjectType.Building;
            });

            this.groundSiteObjects = _.filter(siteObjects, item => {
              return item.type === SiteObjectType.Grounds;
            });

            this.infrastructureSiteObjects = _.filter(siteObjects, item => {
              return item.type === SiteObjectType.Infrastructure;
            });
          },
            (error) => {
              this.errors.push({ severity: "error", summary: "Site Objects Error", detail: error });
            },
            () => {
              this.buildForm();
              this.loading = false;
              this.loaded = true;
            });
        });
      } else {
        this.site = new SiteDetail(this.getEmptyGuid(), true, new Date(), "", "", "", "", "", SiteType.Agricultural,
          "", "", this.businessId, "", this.getEmptyGuid(), "", "", "", "", 0, 0);
        this.buildForm();
        this.loading = false;
        this.loaded = true;
      }
    }, (error) => {
      this.errors.push({ severity: "error", summary: "Site Error", detail: error });
    }, () => {
    });
  }

  buildForm(): void {
    if (this.site) {
      let nameControl: any;
      let codeControl: any;

      if (this.siteId) {
        nameControl = [this.site.name || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteNameExists(this.authHttp, this.businessId, this.siteId)];

        codeControl = [this.site.code || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteCodeExists(this.authHttp, this.businessId, this.siteId)];
      } else {
        nameControl = [this.site.name || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteNameExists(this.authHttp, this.businessId)];

        codeControl = [this.site.code || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteCodeExists(this.authHttp, this.businessId)];
      }

      this.siteForm = this.fb.group({
        "id": [this.site.id || this.getEmptyGuid()],
        "active": [this.site.active || true],
        "name": nameControl,
        "code": codeControl,
        "description": [this.site.description || "", Validators.maxLength(1000)],
        "parkingDetails": [this.site.parkingDetails || "", Validators.maxLength(1000)],
        "accessDetails": [this.site.accessDetails || "", Validators.maxLength(1000)],
        "type": [this.site.type, Validators.required],
        "businessId": [this.site.businessId || ""],
        "addressId": [this.site.addressId || this.getEmptyGuid()],
        "addressStreet": [this.site.addressStreet || "",
        Validators.compose([Validators.required, Validators.maxLength(100)])],
        "addressSuburb": [this.site.addressSuburb || "",
        Validators.compose([Validators.required, Validators.maxLength(100)])],
        "addressPostcode": [this.site.addressPostCode || "",
        Validators.compose([Validators.required, Validators.maxLength(100)])],
        "addressRegion": [this.site.addressRegion, Validators.required],
        "addressCountry": [this.site.addressCountry, Validators.required],
        "fileName": [this.fileName || "", [Validators.maxLength(100)]],
        "fileSource": [this.fileSource || "", [Validators.maxLength(100)]],
        "safetyInstructionId": [this.site.safetyInstructionId || ""]
      });
    }
  }

  onSubmit(value: any): void {
    this.submitted = true;
    if (this.siteForm.valid) {
      this.loading = true;
      value.complianceItems = this.site.complianceItems;
      this.siteService.saveSite(value).finally(() => {
        this.loading = false;
      }).subscribe(
        (site) => {
          this.router.navigate(["business", this.businessId, "view"])
        },
        (error) => {
          this.errors.push({ severity: "error", summary: "Site Error", detail: error });
        });
    }
  }

  complianceItemSelected(item: ComplianceItemDetail): void {
    this.siteForm.markAsDirty();
    if (!_.where(this.site.complianceItems, { id: item.id }).length) {
      this.site.complianceItems.push(item);
    }
  }

  complianceItemUnselected(item: ComplianceItemDetail): void {
    this.siteForm.markAsDirty();
    this.site.complianceItems = _.without(this.site.complianceItems, _.findWhere(this.site.complianceItems, {
      id: item.id
    }));
  }

  getPanelHeaderClass(section: string): string {
    if (section === "main") {
      if (!this.isMainTabValid()) {
        return "header-error";
      }
    }

    if (section === "location") {

    }

    return "";
  }

  isMainTabValid(): boolean {
    return this.siteForm.controls["name"].valid;
  }

  isNewSite() {
    return this.isEmptyGuid(this.site.id) || this.site.id === "";
  }

  onBeforeSend(event) {
    const asset = {
      id: this.site.id,
      fileName: this.siteForm.controls["fileName"].value,
      fileSource: this.siteForm.controls["fileSource"].value
    }

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService.getAuth().access_token}`);
    event.formData.set("fileDetails", JSON.stringify(asset));
  }

  onBeforeUpload(event) {

  }

  isFileUploadValid() {
    if (!this.fileValidationRequired) {
      return true;
    }

    return this.siteForm.controls["fileName"].value.length > 0 && this.siteForm.controls["fileSource"].value.length > 0;
  }

  onFileSelected(event) {
    this.fileValidationRequired = true;
  }

  onUploadError(event) {
    this.loading = false;
    this.fileValidationRequired = false;
    const message = JSON.parse(event.xhr.responseText).Message;
    this.errors.push({ severity: "error", summary: "Site Files Error", detail: message });
    this.scrollToTop();
  }

  showDocumentImages() {
    this.displayDocumentImages = !this.displayDocumentImages;
    if (this.displayDocumentImages) {
      this.documentImagesButtonText = "Hide Images";
    } else {
      this.documentImagesButtonText = "Show Images";
    }
  }

  showUploadButton() {
    return this.fileName === "" || this.fileSource === "";
  }

  onUploadFiles(event) {
    this.siteForm.markAsDirty();

    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.siteService.getFiles(this.site.id).finally(() => {
      this.loading = false;
      this.fileValidationRequired = false;
    }).subscribe(
      files => this.site.files = files,
      (error) => {
        this.errors.push({ severity: "error", summary: "Site Files Error", detail: error });
      }
      );

    this.uploadedFiles = [];
  }

  deleteFile(file: SiteFile) {
    this.siteForm.markAsDirty();
    this.siteService.deleteFile(file.siteId, file.id).subscribe(
      this.site.files = _.filter(this.site.files, (item) => {
        return item.id !== file.id;
      }),
      (error) => {
        this.errors.push({ severity: "error", summary: "Site Files Error", detail: error });
      },
      this.loading = false
    );
  }

  onSelectFiles(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.errors = [];
    this.errors.push({ severity: "info", summary: "File Uploaded", detail: "" });
  }

  openMap() {
    window.open(this.openMapUrl(), "_blank");
  }

  openMapUrl() {
    return `https://www.google.com.au/maps/place/
      ${this.site.addressStreet}+${this.site.addressSuburb}+${this.site.stateString}+${this.site.addressPostCode}`;
  }
}
