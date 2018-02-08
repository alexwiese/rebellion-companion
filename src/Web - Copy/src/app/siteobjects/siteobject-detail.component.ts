import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { SiteObjectDetail, SiteObjectType, BuildingType } from "app/models/siteobjects/siteobject-detail";
import { SiteDetail } from "app/models/sites/site-detail";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { AuthService } from "app/services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";
import * as _ from "underscore";

@Component({
  selector: "aed-siteobject-detail",
  templateUrl: "./siteobject-detail.component.html",
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
export class SiteObjectDetailComponent extends BaseComponent implements OnInit {

  siteObject: SiteObjectDetail;
  siteObjectForm: FormGroup;
  submitted = false;
  siteObjectId: string;
  siteId: string;
  site: SiteDetail;
  siteObjectType: any;
  siteObjectTypeName = "Site Object";

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private authService: AuthService,
    private siteService: SiteService,
    private siteObjectService: SiteObjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    this.siteId = this.activatedRoute.snapshot.params["siteId"];
    this.siteObjectId = this.activatedRoute.snapshot.params["id"];
    this.siteObjectType = this.activatedRoute.snapshot.params["siteObjectType"];

    this.siteService.getSite(this.siteId).subscribe((site) => {
      this.site = site;

      if (this.siteObjectId) {
        this.siteObjectService.getSiteObject(this.siteObjectId).subscribe((siteObject) => {
          this.siteObject = siteObject;
        },
          (error) => {
            this.errors.push({ severity: "error", summary: "Site Object Error", detail: error });
          },
          () => {
            this.buildForm();
            this.loading = false;
            this.loaded = true;
          }
        );
      } else {
        let siteObjectType = SiteObjectType.Building;
        if (this.siteObjectType) {
          siteObjectType = <SiteObjectType>(parseInt(this.siteObjectType, 10));
          this.siteObjectTypeName = SiteObjectType[siteObjectType];
        }

        this.siteObject = new SiteObjectDetail("", new Date(), "", "", "", "", siteObjectType, BuildingType.None,
          0, 0.0, 0.0, "", "", "", "", this.site.id,
          this.site.name, this.site.businessId, this.site.businessName, true, {});

        this.buildForm();
        this.loading = false;
        this.loaded = true;
      }
    },
      (error) => {
        this.errors.push({ severity: "error", summary: "Asset Error", detail: error });
      });
  }

  buildForm(): void {
    if (this.siteObject) {

      let nameControl: any;

      if (this.siteObjectId) {
        nameControl = [this.siteObject.name || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteObjectNameExists(this.authHttp, this.siteObject.businessId, this.siteObjectId)];
      } else {
        nameControl = [this.siteObject.name || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.siteObjectNameExists(this.authHttp, this.siteObject.businessId)];
      }

      this.siteObjectForm = this.fb.group({
        "id": [this.siteObject.id || this.getEmptyGuid()],
        "active": [this.siteObject.active || true],
        "createdDate": [this.siteObject.createdDate || new Date()],
        "name": nameControl,
        "code": [this.siteObject.code || "", Validators.maxLength(100)],
        "identity": [this.siteObject.identity || ""],
        "legacyId": [this.siteObject.legacyId || "", Validators.maxLength(100)],
        "type": [this.siteObject.type || "", Validators.required],
        "buildingType": [this.siteObject.buildingType || "", Validators.required],
        "numberOfFloors": [this.siteObject.numberOfFloors || 0],
        "netLettableArea": [this.siteObject.netLettableArea || 0.0],
        "totalFloorArea": [this.siteObject.totalFloorArea || 0.0],
        "siteId": [this.siteObject.siteId || "", Validators.required],
        "pointOfContactName": [this.siteObject.pointOfContactName || "", Validators.maxLength(100)],
        "contactNumber": [this.siteObject.contactNumber || "", Validators.maxLength(20)],
        "parkingDetails": [this.siteObject.parkingDetails || "", Validators.maxLength(1000)],
        "additionalInformation": [this.siteObject.additionalInformation || "", Validators.maxLength(1000)],
        "addressId": [this.siteObject.addressId || this.getEmptyGuid()],
        "addressStreet": [this.siteObject.addressStreet || "",
        Validators.compose([Validators.required, Validators.maxLength(100)])],
        "addressSuburb": [this.siteObject.addressSuburb || "",
        Validators.compose([Validators.required, Validators.maxLength(100)])],
        "addressPostcode": [this.siteObject.addressPostCode || "",
        Validators.compose([Validators.required, Validators.maxLength(4), Validators.minLength(4)])],
        "addressRegion": [this.siteObject.addressRegion, Validators.required],
        "addressCountry": [this.siteObject.addressCountry, Validators.required]
      });
    }
  }

  onSubmit(value: any): void {
    this.submitted = true;
    if (this.siteObjectForm.valid) {
      this.loading = true;
      this.siteObjectService.saveSiteObject(value).subscribe(
        siteObject => this.location.back(),
        error => this.errors.push({ severity: "error", summary: "Asset Error", detail: error }),
        this.loading = false
      );
    }
  }
}
