import { isSimpleTemplateString } from "codelyzer/util/astQuery";
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Http, Response } from "@angular/http";
import { BaseComponent } from "../shared/base.component";
import {
  WorkInstructionDetail,
  WorkInstructionType
} from "../models/workinstructions/workinstruction-detail";
import { WorkInstructionTask } from "../models/workinstructions/workinstructiontask";
import { WorkInstructionService } from "../services/workinstruction.service";
import { AssetService } from "../services/asset.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { environment } from "environments/environment";
import { AssetType } from "app/models/assets/asset";
import * as _ from "underscore";

@Component({
  selector: "aed-workinstruction-detail",
  templateUrl: "./workinstruction-detail.component.html",
  styles: [`.mr-10 { margin-right: 10px; }`]
})
export class WorkInstructionDetailComponent extends BaseComponent
  implements OnInit {
  workInstructionId: string;
  workInstructionForm: FormGroup;
  workInstruction: WorkInstructionDetail = null;
  submitted = false;
  assetTypes: AssetType[] = [];

  constructor(
    private http: Http,
    private authService: AuthService,
    private assetService: AssetService,
    private workInstructionService: WorkInstructionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location
  ) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    this.workInstructionId = this.activatedRoute.snapshot.params["id"];

    this.workInstructionService
      .getWorkInstruction(this.workInstructionId)
      .finally(() => {
        this.loading = false;
      })
      .flatMap(item => {
        this.workInstruction = item;
        return this.assetService.getAssetTypes();
      })
      .subscribe(
        assetTypes => {
          this.assetTypes = assetTypes;
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Work Instructions Error",
            detail: error
          });
        },
        () => {
          this.buildForm();
          this.loading = false;
          this.loaded = true;
        }
      );
  }

  buildForm(): void {
    if (this.workInstruction) {
      this.workInstructionForm = this.fb.group({
        id: [this.workInstruction.id || this.getEmptyGuid()],
        isDefault: [this.workInstruction.isDefault || false],
        active: [this.workInstruction.active || true],
        name: [
          this.workInstruction.name || "",
          [Validators.required, Validators.maxLength(100)]
        ],
        code: [
          this.workInstruction.code,
          [Validators.required, Validators.maxLength(256)]
        ],
        source: [
          this.workInstruction.source,
          [Validators.required, Validators.maxLength(256)]
        ],
        description: [
          this.workInstruction.description,
          Validators.maxLength(1000)
        ],
        type: [this.workInstruction.type, Validators.required]
      });
    }
  }

  assetTypeValidation(value: any): boolean {
    this.errors = [];

    if (
      value.type !== WorkInstructionType.SafetyInstruction &&
      this.workInstruction.assetTypes.length === 0
    ) {
      this.errors.push({
        severity: "error",
        summary: "Work Instruction Error",
        detail:
          "Work instructions of with this type must have at least one Asset Type selected."
      });
      this.scrollToTop();
      return false;
    }

    if (
      value.type === WorkInstructionType.SafetyInstruction &&
      this.workInstruction.assetTypes.length > 0
    ) {
      this.errors.push({
        severity: "error",
        summary: "Work Instruction Error",
        detail:
          "Work instructions of with this type can/'t have any Asset Types selected."
      });
      this.scrollToTop();
      return false;
    }

    return true;
  }

  onSubmit(value: any): void {
    const valid = this.assetTypeValidation(value);

    if (valid) {
      this.submitted = true;
      if (this.workInstructionForm.valid) {
        value.assetTypes = this.workInstruction.assetTypes;
        value.types = this.workInstruction.types;
        value.tasks = this.workInstruction.tasks;
        this.workInstructionService.saveWorkInstruction(value).subscribe(
          item => {
            this.location.back()
          },
          error =>
            this.errors.push({
              severity: "error",
              summary: "Work Instruction Error",
              detail: error
            }),
          (this.loading = false)
        );
      }
    }
  }

  gotBack(): void {
    this.location.back();
  }

  assetTypeSelected(item: AssetType): void {
    this.workInstructionForm.markAsDirty();
    if (!_.where(this.workInstruction.assetTypes, { id: item.id }).length) {
      this.workInstruction.assetTypes.push(item);
      console.log(
        "++ Asset types length = " + this.workInstruction.assetTypes.length
      );
    }
  }

  workInstructionTaskCreated(task: WorkInstructionTask): void {
    this.workInstruction.tasks.push(task);
    console.log("Work Instruction Task Added: " + JSON.stringify(task));
  }

  assetTypeUnselected(item: AssetType): void {
    this.workInstructionForm.markAsDirty();
    this.workInstruction.assetTypes = _.without(
      this.workInstruction.assetTypes,
      _.findWhere(this.workInstruction.assetTypes, {
        id: item.id
      })
    );
    console.log(
      "-- Assest types length = " + this.workInstruction.assetTypes.length
    );
  }

  showAssetTypes() {
    return (
      this.workInstruction.type === WorkInstructionType.MaintenancePlan ||
      this.workInstruction.type === WorkInstructionType.RepairPlan
    );
  }
}
