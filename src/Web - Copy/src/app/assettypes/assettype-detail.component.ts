import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { AssetService } from "app/services/asset.service";
import { WorkInstructionService } from "app/services/workinstruction.service";
import { AssetType, SpecificAttribute } from "app/models/assets/asset";
import { BaseComponent } from "app/shared/base.component";
import { WorkInstructionType } from "../models/workinstructions/workinstruction-detail";
import { WorkInstructionSummary } from "../models/workinstructions/workinstruction-summary";

import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown,
  SelectItem,
  InputTextarea
} from "primeng/primeng";
import * as _ from "underscore";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: "aed-assettype-detail",
  templateUrl: "assettype-detail.component.html",
  styles: []
})
export class AssetTypeDetailComponent extends BaseComponent implements OnInit {
  assetTypeForm: FormGroup;
  assetType: AssetType;
  errors: Message[] = [];
  submitted = false;
  loading = false;
  header = "";
  selectedWorkInstruction: SelectItem = null;
  workInstructions: SelectItem[] = [];
  filteredWorkInstructions: any[];
  cantDeleteMessages: Message[] = [];
  showWarningMessages = false;
  selectedSpecificAttributeNames: string[] = [];
  specificAttributes: SpecificAttribute[] = [];
  specificAttributeDisplayNames: string[] = [];

  @Input() assetTypeId: string;
  @Input() breadCrumb: string;

  @Output()
  onAssetTypeSaved: EventEmitter<AssetType> = new EventEmitter<AssetType>();

  @Output()
  onAssetTypeCancelled: EventEmitter<AssetType> = new EventEmitter<AssetType>();

  constructor(
    private assetService: AssetService,
    private workInstructionService: WorkInstructionService,
    private activatedRoute: ActivatedRoute,
    protected location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(location);
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.assetTypeId) {
      this.workInstructionService
        .getWorkInstructionsByType(WorkInstructionType.MaintenancePlan)
        .flatMap(workInstructions => {
          this.workInstructions.push({ label: "", value: "" });
          workInstructions.forEach(this.addWorkInstructionToList, this);
          return this.assetService.getSpecificAttributes();
        })
        .flatMap(specificAttributes => {
          this.specificAttributes = specificAttributes;

          this.specificAttributes.forEach((sa) => {
            this.specificAttributeDisplayNames.push(sa.display);
          });
          return this.assetService.getAssetType(this.assetTypeId);
        })
        .finally(() => {
          this.buildForm();
          this.loading = false;
        })
        .subscribe(assetType => {
          this.assetType = assetType;
          this.assetType.specificAttributes.forEach((a) => {
            const attribute = _.findWhere(this.specificAttributes, { name: a });
            this.selectedSpecificAttributeNames.push(attribute.display);
          })
          this.header = `Edit Asset Type for class ${this.breadCrumb}`;
          this.setMessages(assetType);
          this.showWarningMessages = true;
        },
        error => {
          this.assetType = new AssetType(this.assetTypeId);
          this.header = `Add Asset Type for class ${this.breadCrumb}`;
        });
    } else {
      this.errors.push({
        severity: "error",
        summary: "Asset Type Error",
        detail: "An AssetClass id is required"
      });
      this.loading = false;
    }
  }

  setMessages(assetType: AssetType) {
    this.cantDeleteMessages.push({
      severity: "warn",
      summary: `Can"t delete Asset Type`,
      detail:
        `Can"t delete Asset Type: The Asset Type is linked to one or more Assets (${assetType.assetNames}). ` +
        `This Asset Type must be removed from all Assets before deletion will be permitted.`
    });
  }

  public addWorkInstructionToList(workInstruction: any) {
    this.workInstructions.push({
      label: workInstruction.name,
      value: workInstruction.id
    });
  }

  buildForm(): void {
    if (this.assetType) {
      this.assetTypeForm = this.fb.group({
        id: [this.assetType.id || "", Validators.required],
        name: [
          this.assetType.name || "",
          Validators.compose([Validators.required, Validators.maxLength(50)])
        ],
        description: [
          this.assetType.description || "",
          Validators.maxLength(1000)
        ],
        tradeType: [this.assetType.tradeType || "", Validators.required],
        workInstruction: [this.assetType.defaultWorkInstructionId || ""],
        selectedSpecificAttributeNames: [this.selectedSpecificAttributeNames]
      });
    }
  }

  cancel() {
    this.onAssetTypeCancelled.emit(this.assetType);
  }

  updateAssetTypeFromFrom(value: any) {
    this.assetType.name = value.name;
    this.assetType.description = value.description;
    this.assetType.tradeType = value.tradeType;
    this.assetType.defaultWorkInstructionId = value.workInstruction;
  }

  onSubmit(value: any): void {
    this.submitted = true;
    if (this.assetTypeForm.valid) {
      this.updateAssetTypeFromFrom(value);
      this.assetService.saveAssetType(this.assetType).subscribe(
        item => {
          this.onAssetTypeSaved.emit(item);
        },
        error =>
          this.errors.push({
            severity: "error",
            summary: "Asset Type Save Error",
            detail: error
          }),
        () => {
          this.loading = false;
        }
      );
    }
  }

  deleteAssetType(id: any) {
    this.loading = true;
    this.assetService.deleteAssetType(id).subscribe(
      (item) => {
        this.onAssetTypeSaved.emit(item);
      },
      error => this.errors.push({ severity: "error", summary: "Delete AssetType Error", detail: error }),
      this.loading = false
    );
  }

  filterBusiness(event) {
    return this.filterSelectItems(event, this.workInstructions);
  }

  oc(event: boolean, attributeName: any) {
    const attribute = _.findWhere(this.specificAttributes, { display: attributeName });

    if (!attribute) {
      this.errors.push({
          severity: "error",
          summary: "Specific Attribute Missing",
          detail: `Specific attribute of type ${attributeName} does not exist.` });
      return
    }

    if (event) {
      this.assetType.specificAttributes.push(attribute.name)
    } else {
      this.assetType.specificAttributes = _.without(this.assetType.specificAttributes, attribute.name);
    }

    this.assetTypeForm.markAsDirty();
  }
}
