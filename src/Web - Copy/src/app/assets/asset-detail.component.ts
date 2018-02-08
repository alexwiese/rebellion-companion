import { WorkInstructionSummary } from "../models/workinstructions/workinstruction-summary";
import { DecimalPipe } from "@angular/common";
import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import { AssetService } from "app/services/asset.service";
import { ModelService } from "app/services/model.service";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { BarcodeService } from "app/services/barcode.service";
import { WorkInstructionService } from "app/services/workinstruction.service";
import { AuthService } from "app/services/auth.service";
import { BaseComponent } from "app/shared/base.component";
import { ModelSummary } from "app/models/models/model-summary";
import { ValidatorService } from "app/services/validator.service";
import {
  Asset,
  AssetFile,
  LegacyIdentity,
  AssetRelationship,
  WorkOrderAsset
} from "app/models/assets/asset";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  Checkbox,
  AutoComplete,
  Calendar,
  Slider,
  SelectItem,
  InputTextarea,
  FileUploadModule,
  RadioButton
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
  selector: "aed-asset-detail",
  templateUrl: "asset-detail.component.html",
  styles: [
    `#file-upload { display: none; }
    #barcode-canvas { display: none; }
    .header-error { color: red; font-weight: bold; }
    .aed-input-ro { width: 90%;
      color: green !important;
      font-weight: bold;
      font-family: "Roboto","Helvetica Neue","sans-serif";
      font-size: 1em;
      border: 1px solid white }`
  ]
})
export class AssetDetailComponent extends BaseComponent implements OnInit {
  asset: Asset;
  legacyIdentity: LegacyIdentity;
  assetForm: FormGroup;
  legacyIdentityForm: FormGroup;
  manufacturers: SelectItem[] = [];
  models: SelectItem[] = [];
  modelList: any[] = [];
  sites: SelectItem[] = [];
  siteObjects: SelectItem[] = [];
  errors: Message[] = [];
  warnings: Message[] = [];
  submitted = false;
  loading = false;
  loaded = false;
  minDate: Date = void 0;
  showDatePicker = false;
  loadingLonLat = false;
  barcodeFile: File = null;
  loadingBarcode = false;
  manufacturerId = "";
  modelId = "";
  selectedModel: any = null;
  showAddLegacyIdentity = false;

  // Asset Class variables
  assetClasses: any[] = [];
  assetClassOneSelectItems: SelectItem[] = [];
  assetClassTwoSelectItems: SelectItem[] = [];
  assetClassThreeSelectItems: SelectItem[] = [];
  assetClassFourSelectItems: SelectItem[] = [];

  // Upload files variables
  uploadFilesUrl = "";
  uploadedFiles: any[] = [];
  fileName = "";
  fileSource = "";
  displayDocumentImages = false;
  documentImagesButtonText = "Show Images";
  fileValidationRequired = false;

  // Asset relationships
  relationships: AssetRelationship[] = [];

  // Work Instructions
  workInstructions: SelectItem[] = [];

  // WorkOrder Asset
  workOrderId = null;

  private decodeResult: any;

  constructor(
    private assetService: AssetService,
    private modelService: ModelService,
    private siteService: SiteService,
    private siteObjectService: SiteObjectService,
    private barcodeService: BarcodeService,
    private workInstructionService: WorkInstructionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    protected location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(location);
  }

  ngOnInit(): void {
    this.loading = true;

    this.uploadFilesUrl = this.assetService.fileUploadUrl();

    this.warnings.push({
      severity: "warn",
      summary: "Asset type not specified",
      detail:
        "Further identification of the asset is required before work orders can be created"
    });

    const id = this.activatedRoute.snapshot.params["id"];
    const siteId = this.activatedRoute.snapshot.params["siteId"];
    const siteObjectId = this.activatedRoute.snapshot.params["siteObjectId"];
    const workOrderId = this.activatedRoute.snapshot.params["workOrderId"];

    if (workOrderId) {
      this.workOrderId = workOrderId;
    }

    this.assetService
      .getAsset(id)
      .flatMap(asset => {
        this.asset = asset;

        if (siteId) {
          this.asset.siteId = siteId;
        }

        if (siteObjectId) {
          this.asset.siteObjectId = siteObjectId;
        }

        return this.assetService.getRelationships(this.asset.id);
      })
      .flatMap(relationships => {
        console.log("asset-detail: relationships(): " + new Date());
        this.relationships = relationships;

        return this.workInstructionService.getWorkInstructionsForUser();
      })
      .flatMap(workInstructions => {
        this.setDefaultObject(this.workInstructions);
        workInstructions.forEach(i => {
          this.workInstructions.push({ label: i.name, value: i.id });
        });
        return this.siteService.getAllSites();
      })
      .flatMap(sites => {
        sites.forEach(s => {
          this.sites.push({ label: s.name, value: s.id });
        });
        this.setDefaultObject(this.sites);

        if (this.asset.siteId) {
          return this.siteObjectService.filterSiteObjects(this.asset.siteId);
        } else {
          return Observable.of(<any>[]);
        }
      })
      .subscribe(
        siteObjects => {
          siteObjects.forEach(i => {
            this.siteObjects.push({ label: i.name, value: i.id });
          });
          this.setDefaultObject(this.siteObjects);
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Asset Error",
            detail: error
          });
        },
        () => {
          this.loading = false;
          this.loaded = true;
          this.buildForm();
        }
      );
  }

  // Validation functions
  getPanelHeaderClass(section: string): string {
    if (section === "main") {
      if (!this.isMainTabValid()) {
        return "header-error";
      }
    }

    if (section === "location") {
      if (!this.isLocationTabValid()) {
        return "header-error";
      }
    }

    if (section === "lifecycle") {
      if (!this.isLifecycleTabValid()) {
        return "header-error";
      }
    }

    return "";
  }

  isMainTabValid(): boolean {
    return (
      this.assetForm.controls["name"].valid &&
      this.assetForm.controls["barcode"].valid &&
      this.assetForm.controls["baseDate"].valid
    );
  }

  isLocationTabValid(): boolean {
    return (
      this.assetForm.controls["siteId"].valid &&
      this.assetForm.controls["siteId"].valid
    );
  }

  isLifecycleTabValid(): boolean {
    return (
      this.assetForm.controls["manufacturedDate"].valid ||
      this.assetForm.controls["installationDate"].valid ||
      this.assetForm.controls["commissioningDate"].valid
    );
  }


  addLegacyIdentity(event: boolean) {
    this.showAddLegacyIdentity = event;

    if (this.showAddLegacyIdentity) {
      this.legacyIdentity = new LegacyIdentity(
        this.assetService.getEmptyGuid(),
        new Date(),
        "",
        "",
        "",
        this.asset.id
      );
      this.buildLegacyIdentityForm();
    }

    this.assetForm.markAsDirty();
  }

  buildLegacyIdentityForm() {
    this.legacyIdentityForm = this.fb.group({
      id: [this.legacyIdentity.id],
      name: [
        this.legacyIdentity.name || "",
        [Validators.required, Validators.maxLength(100)]
      ],
      source: [
        this.legacyIdentity.source,
        [Validators.required, Validators.maxLength(100)]
      ],
      owner: [
        this.legacyIdentity.owner || "",
        [Validators.required, Validators.maxLength(100)]
      ],
      assetId: [this.legacyIdentity.assetId || "", Validators.required]
    });
  }

  editLegacyIdentity(item: LegacyIdentity) {
    this.showAddLegacyIdentity = true;

    if (this.showAddLegacyIdentity) {
      this.legacyIdentity = item;
      this.buildLegacyIdentityForm();
    }

    this.assetForm.markAsDirty();
  }

  deleteLegacyIdentity(item: LegacyIdentity) {
    this.asset.legacyIdentities = _.filter(
      this.asset.legacyIdentities,
      function(i) {
        return item.id !== i.id;
      }
    );

    this.asset.legacyIdentities = this.asset.legacyIdentities.slice();
    this.showAddLegacyIdentity = false;
    this.assetForm.markAsDirty();
  }

  addLegacyInfo(value: any) {
    if (value.id && !this.isEmptyGuid(value.id)) {
      const existing = _.find(this.asset.legacyIdentities, function(item) {
        return item.id === value.id;
      });

      existing.id = value.id;
      existing.name = value.name;
      existing.source = value.source;
      existing.owner = value.owner;
    } else {
      const iden = new LegacyIdentity(
        this.assetService.getEmptyGuid(),
        new Date(),
        value.name,
        value.source,
        value.owner,
        this.asset.id
      );
      this.asset.legacyIdentities.push(iden);
    }

    this.asset.legacyIdentities = this.asset.legacyIdentities.slice();
    this.showAddLegacyIdentity = false;
  }

  isNewAsset() {
    return this.isEmptyGuid(this.asset.id) || this.asset.id === "";
  }

  onBeforeSend(event) {
    const asset = {
      id: this.asset.id,
      fileName: this.assetForm.controls["fileName"].value,
      fileSource: this.assetForm.controls["fileSource"].value
    };

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader(
      "Authorization",
      `Bearer ${this.authService.getAuth().access_token}`
    );
    event.formData.set("fileDetails", JSON.stringify(asset));
  }

  onBeforeUpload(event) {}

  isFileUploadValid() {
    if (!this.fileValidationRequired) {
      return true;
    }

    return (
      this.assetForm.controls["fileName"].value.length > 0 &&
      this.assetForm.controls["fileSource"].value.length > 0
    );
  }

  onFileSelected(event) {
    this.fileValidationRequired = true;
  }

  onUploadError(event) {
    this.loading = false;
    this.fileValidationRequired = false;
    const message = JSON.parse(event.xhr.responseText).Message;
    this.errors.push({
      severity: "error",
      summary: "Asset Files Error",
      detail: message
    });
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
    this.assetForm.markAsDirty();

    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.assetService
      .getFiles(this.asset.id)
      .finally(() => {
        this.loading = false;
        this.fileValidationRequired = false;
      })
      .subscribe(
        files => (this.asset.files = files),
        error => {
          this.errors.push({
            severity: "error",
            summary: "Asset Files Error",
            detail: error
          });
        }
      );

    this.uploadedFiles = [];
  }

  deleteFile(file: AssetFile) {
    this.assetForm.markAsDirty();
    this.assetService.deleteFile(file.assetId, file.id).subscribe(
      (this.asset.files = _.filter(this.asset.files, item => {
        return item.id !== file.id;
      })),
      error => {
        this.errors.push({
          severity: "error",
          summary: "Asset Files Error",
          detail: error
        });
      },
      (this.loading = false)
    );
  }

  onSelectFiles(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.errors = [];
    this.errors.push({
      severity: "info",
      summary: "File Uploaded",
      detail: ""
    });
  }

  buildForm(): void {
    if (this.asset) {
      this.assetForm = this.fb.group({
        id: [this.asset.id || ""],
        createdDate: [
          this.asset.createdDate || new Date(),
          Validators.required
        ],
        identity: [this.asset.identity || ""],
        name: [
          this.asset.name || "",
          [Validators.required, Validators.maxLength(100)]
        ],
        description: [this.asset.description || "", Validators.maxLength(1000)],
        barcode: [this.asset.barcode || "", ValidatorService.barcodeValidator],
        serialNumber: [this.asset.serialNumber || "", Validators.maxLength(30)],
        constructionTagNumber: [
          this.asset.constructionTagNumber || "",
          Validators.maxLength(30)
        ],
        assetStatus: [this.asset.assetStatus, Validators.required],
        assetCriticality: [this.asset.assetCriticality, Validators.required],
        assetCondition: [this.asset.assetCondition || 0, Validators.required],
        maintenanceStrategy: [this.asset.maintenanceStrategy],
        maintenancePlanName: [this.asset.maintenancePlanName || ""],
        maintenancePlanId: [this.asset.maintenancePlanId || ""],
        assetTypeId: [this.asset.assetTypeId],
        assetTypeName: [this.asset.assetTypeName],
        baseDate: [this.asset.baseDate, Validators.required],
        longitude: [this.asset.longitude || ""],
        latitude: [this.asset.latitude || ""],
        locationLevel: [
          this.asset.locationLevel || "",
          Validators.maxLength(100)
        ],
        locationRoom: [
          this.asset.locationRoom || "",
          Validators.maxLength(100)
        ],
        locationDescription: [
          this.asset.locationDescription || "",
          Validators.maxLength(1000)
        ],
        siteId: [this.asset.siteId || "", Validators.required],
        siteObjectId: [this.asset.siteObjectId || ""],
        assetSelectionMode: [""],
        manufacturerId: [this.manufacturerId || ""],
        modelId: [this.modelId || ""],
        assetClassOne: [""],
        assetClassTwo: [""],
        assetClassThree: [""],
        assetClassFour: [""],
        assetClassId: [this.asset.assetClassId || ""],
        fileName: [this.fileName || "", [Validators.maxLength(100)]],
        fileSource: [this.fileSource || "", [Validators.maxLength(100)]],
        manufacturedDate: [this.asset.manufacturedDate, ValidatorService.dateAfterTodayValidator],
        installationDate: [this.asset.installationDate, ValidatorService.dateAfterTodayValidator],
        commissioningDate: [this.asset.commissioningDate, ValidatorService.dateAfterTodayValidator]
      });
    }
  }

  onAssetTypeSelectClicked(type: string) {
    this.manufacturers = [];
    this.models = [];
    this.selectedModel = null;
    this.asset.assetTypeName = "";
    this.asset.assetTypeId = "";

    if (type === "manufacturer") {
      if (this.manufacturers && this.manufacturers.length === 0) {
        return this.getManufacturers();
      }
    }

    if (type === "assetClass") {
      if (this.assetClasses && this.assetClasses.length === 0) {
        return this.getAssetClassOnes();
      }
    }
  }

  onSubmit(value: any): void {
    this.submitted = true;
    this.errors = [];

    if (this.assetForm.valid) {
      if (this.workOrderId) {
        value.workOrderId = this.workOrderId;
        value.assetTypeId = this.asset.assetTypeId;
        value.assetClassId = this.asset.assetClassId;
        this.assetService.saveWorkOrderAsset(value).subscribe(
          woa => {
            this.router.navigate(["workorder", this.workOrderId]);
          },
          error => {
            this.errors.push({
              severity: "error",
              summary: "WorkOrder Asset Error",
              detail: error
            });
            this.scrollToTop();
          },
          (this.loading = false)
        );
      } else {
        value.legacyIdentities = this.asset.legacyIdentities;
        value.assetTypeId = this.asset.assetTypeId;
        value.assetClassId = this.asset.assetClassId;
        this.assetService.saveAsset(value).subscribe(
          asset => {
            this.location.back();
          },
          error => {
            this.errors.push({
              severity: "error",
              summary: "Asset Error",
              detail: error
            });
            this.scrollToTop();
          },
          (this.loading = false)
        );
      }
    } else {
      this.getErrorCount(this.assetForm);
    }
  }

  onManufacturerChange(event) {
    this.models = [];
    this.asset.assetTypeName = "";
    this.asset.assetTypeId = "";

    this.modelService.getModels(event.value).subscribe(models => {
      this.modelList = models;
      this.setDefaultObject(this.models);
      models.forEach(i => {
        this.models.push({ label: i.name, value: i.id });
      });
    });
  }

  onModelChange(event) {
    this.asset.assetTypeName = "";
    this.asset.assetTypeId = "";

    const result = _.find(this.modelList, function(item) {
      return item.id === event.value;
    });

    this.selectedModel = result;

    if (this.selectedModel) {
      this.asset.assetTypeName = this.selectedModel.assetTypeName;
      this.asset.assetTypeId = this.selectedModel.assetTypeId;
    }
  }

  getSites() {
    this.siteService.getAllSites().subscribe(sites => {
      sites.forEach(s => {
        this.sites.push({ label: s.name, value: s.id });
      });
      this.setDefaultObject(this.sites);
    });
  }

  onSiteChanged(event) {
    this.getSiteObjects(event.value);
  }

  getSiteObjects(siteId: string) {
    this.siteObjects = [];
    this.siteObjectService.filterSiteObjects(siteId).subscribe(siteObjects => {
      siteObjects.forEach(i => {
        this.siteObjects.push({
          label: i.name.toString(),
          value: i.id.toString()
        });
      });
      this.setDefaultObject(this.siteObjects);
    });
  }

  getManufacturers() {
    this.modelService.getManufacturers().subscribe(
      manufacturers => {
        this.setDefaultObject(this.manufacturers);
        manufacturers.forEach(i => {
          this.manufacturers.push({ label: i.name, value: i.id });
        });
      },
      error => {
        this.errors.push({
          severity: "error",
          summary: "Get Manufacturers Error",
          detail: error
        });
      },
      () => {
        this.loading = false;
      }
    );
  }

  getAssetClassOnes() {
    this.assetService
      .getAssetClassesByLevel()
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        assetClasses => {
          this.assetClasses = assetClasses;

          const assetClassOnes = _.filter(this.assetClasses, function(item) {
            return item.level === 1;
          });

          assetClassOnes.forEach(i => {
            this.assetClassOneSelectItems.push({ label: i.name, value: i.id });
          });
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Get Asset Classes Error",
            detail: error
          });
        }
      );
  }

  setAssetTypeName(event) {
    const assetClass = _.find(this.assetClasses, function(item) {
      return item.id === event.value;
    });

    if (assetClass) {
      this.asset.assetClassId = assetClass.id;
    }

    if (assetClass && assetClass.assetTypeName) {
      this.asset.assetTypeId = assetClass.assetTypeId;
      this.asset.assetTypeName = assetClass.assetTypeName;
    } else {
      this.asset.assetTypeId = null;
      this.asset.assetTypeName = null;
    }
  }

  selectAssetClassOne(event) {
    this.setAssetTypeName(event);

    this.assetClassTwoSelectItems = [];
    this.assetClassThreeSelectItems = [];
    this.assetClassFourSelectItems = [];

    const assetClass = _.find(this.assetClasses, function(item) {
      return item.id === event.value;
    });

    const assetClassTwos = _.filter(this.assetClasses, (ac: any) => {
      return ac.level === 2 && ac.parentAssetClassId === assetClass.id;
    });

    this.assetClassTwoSelectItems.push({ label: "", value: "" });
    if (assetClassTwos.length > 0) {
      assetClassTwos.forEach(i => {
        this.assetClassTwoSelectItems.push({ label: i.name, value: i.id });
      });
    }
  }

  selectAssetClassTwo(event) {
    this.setAssetTypeName(event);

    this.assetClassThreeSelectItems = [];
    this.assetClassFourSelectItems = [];

    const assetClass = _.find(this.assetClasses, function(item) {
      return item.id === event.value;
    });

    const assetClassThrees = _.filter(this.assetClasses, (ac: any) => {
      return ac.level === 3 && ac.parentAssetClassId === assetClass.id;
    });

    this.assetClassThreeSelectItems.push({ label: "", value: "" });
    if (assetClassThrees.length > 0) {
      assetClassThrees.forEach(i => {
        this.assetClassThreeSelectItems.push({ label: i.name, value: i.id });
      });
    }
  }

  selectAssetClassThree(event) {
    this.setAssetTypeName(event);
    this.assetClassFourSelectItems = [];

    const assetClass = _.find(this.assetClasses, function(item) {
      return item.id === event.value;
    });

    const assetClassFours = _.filter(this.assetClasses, (ac: any) => {
      return ac.level === 4 && ac.parentAssetClassId === assetClass.id;
    });

    this.assetClassFourSelectItems.push({ label: "", value: "" });
    if (assetClassFours.length > 0) {
      assetClassFours.forEach(i => {
        this.assetClassFourSelectItems.push({ label: i.name, value: i.id });
      });
    }
  }

  selectAssetClassFour(event) {
    this.setAssetTypeName(event);
  }

  getLongLatSuccess(position: any) {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    if (this.asset) {
      this.asset.longitude = position.coords.longitude;
      this.asset.latitude = position.coords.latitude;
    }

    this.loadingLonLat = false;
  }

  getLongLatFailure(e: any) {
    this.errors.push({
      severity: "error",
      summary: "Geolocation Error",
      detail: JSON.stringify(e.message)
    });
    this.loadingLonLat = false;
    this.scrollToTop();
  }

  setPosition(position: any) {
    if (position) {
      this.asset.longitude = position.coords.longitude;
      this.asset.latitude = position.coords.latitude;
    }

    this.loadingLonLat = false;
  }

  getLonLat($event) {
    $event.preventDefault();

    this.loadingLonLat = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getLongLatSuccess.bind(this),
        this.getLongLatFailure.bind(this),
        { timeout: 10000 }
      );
    }
  }

  fileSelected(event) {
    try {
      this.loadingBarcode = true;
      const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
      const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
      const files: FileList = target.files;
      this.barcodeFile = files[0];
      this.drawOnCanvas(event, this.barcodeFile);
    } catch (e) {
      this.errors.push({
        severity: "error",
        summary: "Barcode Error",
        detail: e
      });
    }
  }

  setBarcode(results: any[]): void {
    let result = "Cannot determine barcode";

    if (results && results[0]) {
      result = results[0].Value;
    }

    this.assetForm.controls["barcode"].setValue(result);
  }

  drawOnCanvas(event, file) {
    const reader = new FileReader();
    const canvas = event.currentTarget.parentElement.children["barcode-canvas"];
    const ctx = canvas.getContext("2d");
    const that = this;

    reader.onload = function(e) {
      const dataURL = (<any>e).target.result,
        img = new Image();

      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        that.barcodeService.getBarcode(img, that.setBarcode.bind(that));
        that.loadingBarcode = false;
      };

      img.src = dataURL;
    };

    reader.readAsDataURL(file);
  }

  hasLongLat() {
    return this.asset.longitude && this.asset.latitude;
  }

  showVerified() {
    return this.asset.lastVerifiedStatus != null && this.asset.lastVerifiedStatus !== 1;
  }

  openMapUrl() {
    return (
      "http://maps.google.com/maps?q=loc:" +
      this.asset.latitude +
      "," +
      this.asset.longitude +
      "&z=17"
    );
  }

  openMap() {
    window.open(this.openMapUrl(), "_blank");
  }
}
