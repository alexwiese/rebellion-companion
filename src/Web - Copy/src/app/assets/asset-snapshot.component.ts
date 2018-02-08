import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AssetService } from "../services/asset.service";
import { BusinessService } from "app/services/business.service";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { AuthService } from "app/services/auth.service";
import { BaseComponent } from "../shared/base.component";
import { PagerComponent } from "app/shared/pager.component";
import { AssetSnapshot } from "../models/assets/asset";
import { InputText, Button, Message, SelectItem } from "primeng/primeng";
import * as _ from "underscore";

@Component({
  selector: "aed-asset-snapshot",
  templateUrl: "asset-snapshot.component.html"
})
export class AssetSnapshotComponent extends PagerComponent<AssetSnapshot>
  implements OnInit {
  snapshotForm: FormGroup;
  snapshotDate: Date = new Date();
  businesses: SelectItem[] = [];
  businessId = "";
  sites: SelectItem[] = [];
  siteId = "";
  buildings: SelectItem[] = [];
  buildingId = "";

  assetTypes: SelectItem[] = [];
  statusTypes: SelectItem[] = [];
  conditionTypes: SelectItem[] = [];
  conditionObjectDescriptions: SelectItem[] = [];
  siteObjectDescriptions: SelectItem[] = [];
  siteObjectTypes: SelectItem[] = [];

  @Output()
  onSnapshotDateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(
    private assetService: AssetService,
    private businessService: BusinessService,
    private siteService: SiteService,
    private siteObjectService: SiteObjectService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    protected location: Location,
    private fb: FormBuilder
  ) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    this.businessService
      .getForPerson(this.authService.getPersonDetails().id)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        businesses => {
          this.setBusinesses(businesses);
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Asset Snapshot Error",
            detail: error
          });
        },
        () => {
          this.buildForm();
        }
      );
  }

  private setBusinesses(businesses: any) {
    businesses.forEach(i => {
      this.businesses.push({ label: i.name, value: i.id });
    });

    if (this.businesses.length > 0) {
      this.businessId = this.businesses[0].value;
      return this.getSites(this.businessId);
    }
  }

  private getSites(businessId: string) {
    this.siteId = "";
    this.buildingId = "";
    this.sites = [];
    this.siteService
      .filterSites(businessId, "")
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        sites => {
          this.setDefaultObject(this.sites, "");
          sites.forEach(i => {
            this.sites.push({ label: i.name, value: i.id });
          });
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Sites Error",
            detail: error
          });
        }
      );
  }

  private setBuildings(siteId: string) {
    this.buildingId = "";
    this.buildings = [];
    this.siteObjectService
      .filterSiteObjects(siteId)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        buildings => {
          this.setDefaultObject(this.buildings, "");
          buildings.forEach(i => {
            this.buildings.push({ label: i.name, value: i.id });
          });
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Buildings Error",
            detail: error
          });
        }
      );
  }

  buildForm(): void {
    this.snapshotForm = this.fb.group({
      snapshotDate: [this.snapshotDate || new Date(), Validators.required],
      businessId: [this.businessId || "", Validators.required],
      siteId: [this.siteId || "", Validators.required],
      buildingId: [this.buildingId || ""]
    });
  }

  onChangeBusiness(event): void {
    event.originalEvent.stopPropagation();
    return this.getSites(event.value);
  }

  onChangeSite(event): void {
    event.originalEvent.stopPropagation();
    return this.setBuildings(event.value);
  }

  onSubmit(value: any) {
    this.loading = true;
    this.items = [];

    if (this.snapshotForm.valid) {
      this.assetService
        .getAssetSnapshot(
          value.snapshotDate,
          value.businessId,
          value.siteId,
          value.buildingId || null
        )
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          assets => {
            this.items = assets;
          },
          error => {
            this.errors.push({
              severity: "error",
              summary: "Asset Snapshot Error",
              detail: error
            });
          }
        );
    }
  }

  snapshotButtonDisabled() {
    return !this.snapshotDate || !this.businessId;
  }

  setAssetTypes(assets: AssetSnapshot[]) {
    const assetTypeNames = _.uniq(_.pluck(assets, "assetTypeName"));
    assetTypeNames.forEach(s => {
      this.assetTypes.push({ label: s, value: s });
    });
  }

  setSites(assets: AssetSnapshot[]) {
    const siteNames = _.sortBy(_.uniq(_.pluck(assets, "siteName")));
    siteNames.forEach(s => {
      this.sites.push({ label: s, value: s });
    });
  }

  setSiteObjectDescriptions(assets: AssetSnapshot[]) {
    const descriptions = _.sortBy(
      _.uniq(_.pluck(assets, "siteObjectDescription"))
    );
    descriptions.forEach(s => {
      this.siteObjectDescriptions.push({ label: s, value: s });
    });
  }

  setStatusTypes() {
    this.statusTypes = this.assetService.getAssetStatusSelectItems();
  }

  setConditionTypes() {
    this.conditionTypes = this.assetService.getAssetConditionSelecItems();
  }

  setSiteObjectTypes() {
    this.siteObjectTypes = this.siteObjectService.getSiteObjectTypeSelecItems();
  }
}
