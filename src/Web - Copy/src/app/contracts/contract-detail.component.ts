import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { ContractDetail, ContractSummary, ContractFile } from "app/models/contracts/contract";
import { ContractService } from "app/services/contract.service";
import { BusinessService } from "app/services/business.service";
import { AuthService } from "app/services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  SelectItem
} from "primeng/primeng";
import "rxjs/add/operator/mergeMap";
import * as _ from "underscore";

@Component({
  selector: "aed-contract-detail",
  templateUrl: "./contract-detail.component.html",
  styles: [`.mr-10 { margin-right: 10px; }`]
})
export class ContractDetailComponent extends BaseComponent implements OnInit {
  contractForm: FormGroup;
  contract: ContractDetail = null;
  contractId: string;
  assetOwnerBusinesses: SelectItem[] = [];
  assetMaintainerBusinesses: SelectItem[] = [];
  uploadFilesUrl = "";
  uploadedFiles: any[] = [];

  constructor(
    private http: Http,
    private authService: AuthService,
    private authHttp: AuthHttp,
    private contractService: ContractService,
    private businessService: BusinessService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validatorService: ValidatorService,
    private fb: FormBuilder,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    this.uploadFilesUrl = this.contractService.fileUploadUrl();

    const id = this.activatedRoute.snapshot.params["id"];

    this.contractService.getContract(id).flatMap((contract) => {
      this.contract = contract;
      return this.businessService.getBusinessesForAssetOwner();
    }).flatMap((businesses) => {
      businesses.forEach((i) => {
        this.assetOwnerBusinesses.push({ label: i.name, value: i.id });
      });
      return this.businessService.getBusinessesForAssetMaintainer();
    }).subscribe((businesses) => {
      businesses.forEach((i) => {
        this.assetMaintainerBusinesses.push({ label: i.name, value: i.id });
      });

      if (this.isNewContract) {
        this.setDefaultObject(this.assetOwnerBusinesses);
        this.setDefaultObject(this.assetMaintainerBusinesses);
      }
    }, (error) => {
      this.errors.push({ severity: "error", summary: "Asset Error", detail: error });
    }, () => {
      this.buildForm();
      this.loading = false;
      this.loaded = true;
    });
  }

  buildForm(): void {
    if (this.contract) {
      this.contractForm = this.fb.group({
        "id": [this.contract.id || ""],
        "active": [this.contract.active || true],
        "name": [this.contract.name || "", Validators.compose([Validators.required, Validators.maxLength(100)]),
        ValidatorService.contractNameExists(this.authHttp, this.contract.id)],
        "contactName": [this.contract.contactName || "", [Validators.required, Validators.maxLength(100)]],
        "contactPhone": [this.contract.contactPhone || "", [Validators.required, Validators.maxLength(20)]],
        "contactEmail": [this.contract.contactEmail || "", [Validators.required, Validators.maxLength(100)]],
        "contactBusinessId": [this.contract.contactBusinessId || "", Validators.required],
        "contractorName": [this.contract.contractorName || "", [Validators.required, Validators.maxLength(100)]],
        "contractorPhone": [this.contract.contractorPhone || "", [Validators.required, Validators.maxLength(20)]],
        "contractorEmail": [this.contract.contractorEmail || "", [Validators.required, Validators.maxLength(100)]],
        "contractorBusinessId": [this.contract.contractorBusinessId || "", Validators.required],
        "contractorRole": [this.contract.contractorRole, Validators.required],
        "tenderSubmissionDate": [this.contract.tenderSubmissionDate || new Date(), Validators.required],
        "contractorAwardDate": [this.contract.contractorAwardDate || new Date(), Validators.required],
        "startDate": [this.contract.startDate || new Date(), Validators.required],
        "endDate": [this.contract.endDate || new Date(), Validators.required]
      });
    }
  }

  onSubmit(value: any): void {
    if (this.contractForm.valid) {
      value.files = this.contract.files;
      this.contractService.saveContract(value).subscribe(
        item => this.location.back(),
        (error) =>  {
          this.errors.push({ severity: "error", summary: "Save Contract Error", detail: error });
          this.scrollToTop();
        },
        this.loading = false
      );
    } else {
      this.getErrorCount(this.contractForm)
    }
  }

  isNewContract() {
    return this.contractService.isNewObject(this.contract);
  }

  onBeforeSend(event) {
    const contract = {
      id: this.contract.id,
      fileName: "",
      fileSource: ""
    }

    event.xhr.open("post", this.uploadFilesUrl, true);
    event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService.getAuth().access_token}`);
    event.formData.set("fileDetails", JSON.stringify(contract));
  }

  onUploadError(event) {
    const message = JSON.parse(event.xhr.responseText).Message;
    this.errors.push({ severity: "error", summary: "Contract Files Error", detail: message });
    this.scrollToTop();
  }

  onUploadFiles(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.contractService.getFiles(this.contract.id).subscribe(
      files => this.contract.files = files,
      (error) => {
        this.errors.push({ severity: "error", summary: "Contract Files Error", detail: error });
      },
      this.loading = false
    );

    this.uploadedFiles = [];

    this.contractForm.markAsDirty();
  }

  deleteFile(file: ContractFile) {
    this.contractForm.markAsDirty();
    this.contractService.deleteFile(file.id).subscribe(
      this.contract.files = _.filter(this.contract.files, (item) => {
        return item.id !== file.id;
      }),
      (error) => {
        this.errors.push({ severity: "error", summary: "Contract Files Error", detail: error });
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
}
