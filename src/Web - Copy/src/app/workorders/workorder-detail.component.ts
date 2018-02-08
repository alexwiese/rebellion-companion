import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Http, Response } from "@angular/http";
import { BaseComponent } from "app/shared/base.component";
import {
  VerificationStatusType,
  WorkOrderAsset,
  AssetConditionType
} from "app/models/assets/asset";
import {
  WorkOrderDetail,
  WorkOrderType,
  WorkOrderStatus,
  WorkOrderAssetClass
} from "app/models/workorders/workorder-detail";
import { WorkOrderService } from "app/services/workorder.service";
import { AssetService } from "app/services/asset.service";
import { BusinessService } from "app/services/business.service";
import { PersonService } from "app/services/person.service";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { environment } from "environments/environment";
import { AssetType } from "app/models/assets/asset";
import { Asset } from "app/models/assets/asset";
import { RoleType } from "app/models/people/person";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  SelectItem,
  ConfirmationService
} from "primeng/primeng";
import * as _ from "underscore";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: "aed-workorder-detail",
  templateUrl: "./workorder-detail.component.html",
  styles: [`.mr-10 { margin-right: 10px; }
  .ui-button.ui-state-active {
  background-color: red;
}`],
  providers: [ConfirmationService]
})
export class WorkOrderDetailComponent extends BaseComponent implements OnInit {
  workOrderId: string;
  workOrderForm: FormGroup;
  workOrder: WorkOrderDetail = null;
  submitted = false;
  assetTypes: AssetType[] = [];
  hasAssetDetails = false;
  barcode = "";
  assetLocation = "";
  assetId: string;
  asset: Asset = null;
  assetDetails: Asset[] = [];
  assets: SelectItem[] = [];
  businesses: SelectItem[] = [];
  people: SelectItem[] = [];
  siteId = "";
  sites: SelectItem[] = [];
  siteObjectId = "";
  siteObjects: SelectItem[] = [];
  assetClassLevelOnes: SelectItem[] = [];
  levels: SelectItem[] = [];
  rooms: SelectItem[] = [];
  assetTypeNames: SelectItem[] = [];
  verificationStatusTypes: SelectItem[] = [];
  assetClassLevelOneFilters: SelectItem[] = [];

  constructor(
    private http: Http,
    private authService: AuthService,
    private workOrderService: WorkOrderService,
    private assetService: AssetService,
    private businessService: BusinessService,
    private personService: PersonService,
    private siteService: SiteService,
    private siteObjectService: SiteObjectService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location
  ) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    this.loaded = false;
    this.workOrderId = this.activatedRoute.snapshot.params["id"];
    this.assetId = this.activatedRoute.snapshot.params["assetId"];
    this.asset = new Asset(this.assetService.getEmptyGuid());

    this.setVerificationStatusTypes();

    this.displaySuccessMessages();

    this.workOrderService
      .getWorkOrder(this.workOrderId)
      .flatMap(item => {
        this.setWorkOrder(item);
        if (this.workOrder.businesses.length > 0) {
          return Observable.of(this.workOrder.businesses);
        } else {
          return this.businessService.getForPerson(
            this.authService.getPersonDetails().id
          );
        }
      })
      .flatMap(businesses => {
        this.setBusinesses(businesses);
        if (this.workOrder.businessId) {
          return this.personService.getForBusiness(this.workOrder.businessId);
        } else {
          this.workOrder.businessId = businesses[0].id;
          return this.personService.getForBusiness(businesses[0].id);
        }
      })
      .flatMap(people => {
        this.setPeople(people);
        return this.siteService.getAllSites();
      })
      .flatMap(sites => {
        this.setSites(sites);
        return this.assetService.getAssetClassesByLevel(1);
      })
      .subscribe(
        assetClasses => {
          this.setAssetClassLevelOnes(assetClasses);
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Work Order Error",
            detail: error
          });
          this.loading = false;
          this.loaded = false;
        },
        () => {
          this.buildForm();
          this.loading = false;
          this.loaded = true;
        }
      );
  }

  setVerificationStatusTypes() {
    this.verificationStatusTypes = this.assetService.getVerificationStatusSelectItems();
  }

  private displaySuccessMessages() {
    if (this.workOrderService.successMessages.length > 0) {
      this.workOrderService.successMessages.forEach(m => {
        const messageTokens = m.split("//");

        this.successMessages.push({
          severity: "success",
          summary: messageTokens[0],
          detail: messageTokens[1]
        });
      });
      this.workOrderService.successMessages = [];
    }
  }

  buildForm(): void {
    if (this.workOrder) {
      this.workOrderForm = this.fb.group({
        id: [this.workOrder.id || ""],
        identity: [this.workOrder.identity || ""],
        active: [this.workOrder.active || true],
        name: [
          this.workOrder.name || "",
          [Validators.required, Validators.maxLength(100)]
        ],
        description: [
          this.workOrder.description,
          [Validators.required, Validators.maxLength(1000)]
        ],
        additionalInformation: [
          this.workOrder.additionalInformation,
          Validators.maxLength(1000)
        ],
        type: [this.workOrder.type, Validators.required],
        trade: [this.workOrder.trade, Validators.required],
        priority: [this.workOrder.priority, Validators.required],
        status: [this.workOrder.status, Validators.required],
        requiredDate: [this.workOrder.requiredDate],
        startDate: [this.workOrder.startDate],
        completedDate: [this.workOrder.completedDate],
        hasAssetDetails: [this.workOrder.hasAssetDetails || false],
        assetSelectionMode: [""],
        assetName: [this.workOrder.assetName || ""],
        assetId: [this.workOrder.assetId || ""],
        barcodeAssetName: [this.asset.name || ""],
        barcode: [this.barcode || ""],
        assetLocation: [this.assetLocation || ""],
        businessId: [this.workOrder.businessId || null, Validators.required],
        personId: [this.workOrder.personId || null],
        siteId: [this.workOrder.siteId || ""],
        siteObjectId: [this.workOrder.siteObjectId || ""],
        assetClassLevelOneId: [this.workOrder.assetClassLevelOneName, ValidatorService.assetClassOneRequired]
      });

      this.subscribeToStatusChanges();
    }
  }

  canAddWorOrderAsset(): boolean {
    return (
      this.workOrder.siteId !== null &&
      this.workOrder.siteId !== "" &&
      this.workOrder.siteObjectId !== null &&
      this.workOrder.siteObjectId !== ""
    );
  }

  isNewWorkOrder() {
    return this.isEmptyGuid(this.workOrder.id);
  }

  workOrderTypeChangedToggled(event) {
    let hasAssetDetails = true;
    if (event.value === WorkOrderType.AssetAudit) {
      hasAssetDetails = false;
    }

    this.workOrder.hasAssetDetails = hasAssetDetails;
    const hasAssetDetailsControl = (<any>this.workOrderForm).controls
      .hasAssetDetails;
    hasAssetDetailsControl.setValue(hasAssetDetails);
    hasAssetDetailsControl.updateValueAndValidity();
  }

  hasAssetDetailsToggled(event) {
    this.workOrder.hasAssetDetails = event.checked;
  }

  showSingularAssetDetails(): boolean {
    return this.workOrder.type !== WorkOrderType.AssetAudit;
  }

  subscribeToStatusChanges() {
    const paymentControl = (<any>this.workOrderForm).controls.status;
    const requiredDateControl = (<any>this.workOrderForm).controls.requiredDate;
    const startDateControl = (<any>this.workOrderForm).controls.startDate;
    const completedDateControl = (<any>this.workOrderForm).controls
      .completedDate;

    paymentControl.valueChanges.subscribe(status => {
      if (status === WorkOrderStatus.Requested) {
        requiredDateControl.setValidators(null);
        startDateControl.setValidators(null);
        completedDateControl.setValidators(null);
      }

      if (status === WorkOrderStatus.WorkAllocated) {
        requiredDateControl.setValidators(
          Validators.compose([Validators.required])
        );
        startDateControl.setValidators(null);
        completedDateControl.setValidators(null);
      }

      if (status === WorkOrderStatus.WorkScheduled) {
        requiredDateControl.setValidators(
          Validators.compose([Validators.required])
        );
        startDateControl.setValidators(
          Validators.compose([Validators.required])
        );
        completedDateControl.setValidators(null);
      }

      if (status === WorkOrderStatus.WorkCompleted) {
        requiredDateControl.setValidators(
          Validators.compose([Validators.required])
        );
        startDateControl.setValidators(
          Validators.compose([Validators.required])
        );
        completedDateControl.setValidators(
          Validators.compose([Validators.required])
        );
      }

      requiredDateControl.updateValueAndValidity();
      startDateControl.updateValueAndValidity();
      completedDateControl.updateValueAndValidity();
    });
  }

  showAdditionalInformationControl(): boolean {
    return this.workOrderForm.controls["hasAssetDetails"].value === false;
  }

  displayAssetCollectionPanel() {
    return (
      this.workOrder &&
      !this.workOrder.hasAssetDetails &&
      this.workOrder.type === WorkOrderType.AssetAudit
    );
  }

  onSubmit(value: any): void {
    this.submitted = true;
    this.loading = true;

    if (this.workOrderForm.valid) {
      value.assetId = this.workOrder.assetId;
      value.hasAssetDetails = this.workOrder.hasAssetDetails;
      value.assets = this.workOrder.assets;
      value.assetClasses = this.workOrder.assetClasses;

      this.workOrderService
        .saveWorkOrder(value)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          item => {
            this.location.back();
          },
          error => {
            this.errors.push({
              severity: "error",
              summary: "Work Order Error",
              detail: error
            });
          }
        );
    }
  }

  gotBack(): void {
    this.location.back();
  }

  searchByBarcode($event, barcode): void {
    $event.preventDefault();
    this.loading = true;

    this.assetService
      .getByBarcode(barcode)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        asset => {
          this.asset = asset;
          this.workOrderForm.controls["barcodeAssetName"].setValue(
            this.asset.name
          );
        },
        error => {
          this.errors = [];
          this.errors.push({
            severity: "error",
            summary: "Find by barcode error",
            detail: "Could not find asset with barcode " + barcode
          });
        }
      );
  }

  searchByAssetLocation($event, location): void {
    $event.preventDefault();
    this.assetDetails = [];
    this.assets = [];
    this.loading = true;

    this.assetService.getbyAddress(location).subscribe(
      assets => {
        this.assetDetails = assets;
        assets.forEach(i => {
          this.assets.push({ label: i.name, value: i.id });
        });
      },
      error => {
        this.errors.push({
          severity: "error",
          summary: "Get Asset By Location Error",
          detail: error
        });
      },
      () => {
        this.loading = false;
      }
    );
  }

  setAsset($event): void {
    $event.preventDefault();

    this.workOrder.assetId = this.asset.id;

    this.workOrderForm.controls["assetName"].setValue(this.asset.name);
    this.workOrderForm.controls["assetLocation"].setValue("");

    this.businesses = [];

    this.getAssetsBusinesses();
  }

  private getAssetsBusinesses() {
    this.businesses = [];
    this.people = [];
    this.workOrder.businessId = "";
    this.workOrder.personId = "";
    this.loading = true;

    this.businessService.getInContracts(this.asset.businessId).subscribe(
      businesses => {
        businesses.forEach(i => {
          this.businesses.push({ label: i.name, value: i.id });
        });
        this.workOrder.businessId = businesses[0].id;
      },
      error => {
        this.errors.push({
          severity: "error",
          summary: "Get Businesses By Assets Business Id Error",
          detail: error
        });
      },
      () => {
        this.loading = false;
      }
    );
  }

  changeSite(siteId: string) {
    this.siteObjects = [];
    this.siteId = siteId;
    this.siteObjectService
      .filterSiteObjects(this.siteId)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        siteObjects => {
          siteObjects.forEach(i => {
            this.siteObjects.push({ label: i.name, value: i.id });
          });
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Get SiteObjects Error for site with id " + this.siteId,
            detail: error
          });
        }
      );
  }

  onSiteChanged(event) {
    this.changeSite(event.value);
  }

  onSiteObjectChanged(event) {
    this.siteObjectId = event.value;
  }

  onAssetClassLevelOneChanged(event) {
    if (
      this.isEmptyGuid(this.workOrder.id) &&
      this.siteObjectId &&
      !this.isEmptyGuid(this.siteObjectId) &&
      event.value &&
      event.value.length > 0
    ) {
      this.loading = true;

      this.workOrder.assetClasses = [];
      event.value.forEach(id => {
        this.workOrder.assetClasses.push(
          new WorkOrderAssetClass(
            this.workOrder.id,
            this.workOrder.name || "",
            id,
            ""
          )
        );
      });

      this.assetService
        .getWorkOrderAssets(this.siteObjectId, event.value, this.workOrder.id)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          assets => {
            this.workOrder.assets = assets;
            setTimeout(() => {
              this.scrollToBottom();
            });
          },
          error => {
            this.errors.push({
              severity: "error",
              summary:
                "Get WorkOrder Assets Error for site with id " + event.value,
              detail: error
            });
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  showWorkOrderAssets(): boolean {
    return !this.isNewWorkOrder();
  }

  onChangeAsset(event): void {
    this.workOrder.assetId = event.value;
    this.asset = _.findWhere(this.assetDetails, { id: event.value });

    this.workOrderForm.controls["assetName"].setValue(this.asset.name);
    this.workOrderForm.controls["barcodeAssetName"].setValue("");

    this.getAssetsBusinesses();
  }

  cloneWorkOrderAsset(item: WorkOrderAsset) {
    this.loading = true;

    const clone = new WorkOrderAsset(
      this.getEmptyGuid(),
      new Date(),
      item.assetTypeName,
      "",
      "",
      "",
      "",
      item.assetId || this.getEmptyGuid(),
      item.workOrderId,
      VerificationStatusType.New,
      item.assetStatus,
      item.assetCriticality,
      AssetConditionType.Average50,
      item.maintenanceStrategy,
      item.assetTypeName,
      item.locationLevel,
      item.locationRoom,
      item.locationDescription,
      item.assetClassLevelOneName,
      item.siteId,
      item.siteObjectId,
      item.assetTypeId,
      item.maintenancePlanId
    );

    this.workOrder.assets = [...this.workOrder.assets, clone];

    this.workOrderForm.markAsDirty();

    this.assetService
      .saveWorkOrderAsset(clone)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        workOrderAsset => {
          this.router.navigate(["asset/edit", workOrderAsset.assetId]);
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Save Asset Error",
            detail: error
          });
        }
      );
  }

  onChangeBusiness(event): void {
    event.originalEvent.stopPropagation();

    this.workOrder.businessId = event.value;
    this.loading = true;
    this.people = [];

    this.personService
      .getForBusiness(this.workOrder.businessId)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        people => {
          this.people = [];
          this.setDefaultObject(this.people, "Unassigned Resource");
          people.forEach(i => {
            this.people.push({
              label: i.fullName + " (" + i.businessName + ")",
              value: i.id
            });
          });
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "People Error",
            detail: error
          });
        }
      );
  }

  onAssetSearchTypeClicked(type: string) {
    this.asset = null;

    if (type === "assetLocation") {
      this.workOrderForm.controls["barcodeAssetName"].setValue("");
    }

    if (type === "barcode") {
      this.assets = [];
      this.assetDetails = [];
    }
  }

  onVerificationTypeChanged(event) {
    this.workOrderForm.markAsDirty();
  }

  showNewVerificationStatus(workOrderAsset: WorkOrderAsset) {
    return (
      workOrderAsset &&
      workOrderAsset.verificationStatus === VerificationStatusType.New
    );
  }

  goToCreateWorkOrderAsset() {
    // TODO: navigate to create WorkOrderAsset view.
  }

  private setWorkOrder(item: any) {
    this.workOrder = item;
    if (this.assetId) {
      this.workOrder.assetId = this.assetId;
    }
    this.hasAssetDetails = this.workOrder.hasAssetDetails;

    this.setRooms(this.workOrder.assets);
    this.setLevels(this.workOrder.assets);
    this.setAssetTypes(this.workOrder.assets);
    this.setAssetClassLevelOneFilters(this.workOrder.assets);
  }

  setRooms(assets: WorkOrderAsset[]) {
    const rooms = _.sortBy(_.uniq(_.pluck(assets, "locationRoom")));
    rooms.forEach(s => {
      this.rooms.push({ label: s, value: s });
    });
  }

  setLevels(assets: WorkOrderAsset[]) {
    const levels = _.sortBy(_.uniq(_.pluck(assets, "locationLevel")));
    levels.forEach(s => {
      this.levels.push({ label: s, value: s });
    });
  }

  setAssetTypes(assets: WorkOrderAsset[]) {
    const assetTypeNames = _.sortBy(_.uniq(_.pluck(assets, "assetTypeName")));
    assetTypeNames.forEach(s => {
      this.assetTypeNames.push({ label: s, value: s });
    });
  }

  setAssetClassLevelOneFilters(assets: WorkOrderAsset[]) {
    const assetClasses = _.sortBy(
      _.uniq(_.pluck(assets, "assetClassLevelOneName"))
    );
    assetClasses.forEach(s => {
      this.assetClassLevelOneFilters.push({ label: s, value: s });
    });
  }

  private setBusinesses(businesses: any) {
    businesses.forEach(i => {
      this.businesses.push({ label: i.name, value: i.id });
    });
    const businessId = this.workOrder.businessId;
  }

  private setPeople(people: any) {
    const person = this.authService.getPersonDetails();
    this.setDefaultObject(this.people, "Unassigned Resource");
    if (person.role === RoleType.FieldWorker) {
      this.people.push({
        label: `${person.firstName} ${person.lastName} (${
          person.businessName
        })`,
        value: person.id
      });
      this.workOrder.personId = person.id;
    } else {
      people.forEach(p => {
        this.people.push({
          label: p.fullName + " (" + p.businessName + ")",
          value: p.id
        });
      });
    }
  }

  private setSites(sites: any) {
    sites.forEach(i => {
      this.sites.push({ label: i.name, value: i.id });
    });
    if (sites.length > 0) {
      this.changeSite(sites[0].id);
    }
  }

  private setAssetClassLevelOnes(assetClasses: any) {
    assetClasses.forEach(i => {
      this.assetClassLevelOnes.push({ label: i.name, value: i.id });
    });
  }

  displayAssetEditButton(id: string) {
    return id && !this.isEmptyGuid(id) && !this.isEmptyGuid(this.workOrder.id);
  }

  displayMergeButton(item: any) {
    return (
      item.verificationStatus === 2 &&
      !this.isEmptyGuid(item.id) &&
      !this.isEmptyGuid(this.workOrder.id)
    );
  }

  displayCloneButton(item: any) {
    return item.assetTypeName && !this.isEmptyGuid(this.workOrder.id);
  }

  confirmClone(asset: WorkOrderAsset) {
    this.confirmationService.confirm({
      message: `Are you sure that you would like to clone the asset [${
        asset.assetTypeName
      }]?`,
      accept: () => {
        this.cloneWorkOrderAsset(asset);
      }
    });
  }
}
