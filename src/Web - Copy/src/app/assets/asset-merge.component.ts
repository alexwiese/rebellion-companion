import { Component, OnInit } from "@angular/core";
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
import { WorkOrderService } from "app/services/workorder.service";
import { BaseComponent } from "app/shared/base.component";
import {
  Asset,
  WorkOrderAsset,
  VerificationStatusType
} from "app/models/assets/asset";
import {
  WorkOrderDetail,
  WorkOrderType,
  WorkOrderStatus
} from "app/models/workorders/workorder-detail";
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
  RadioButton,
  ConfirmationService
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
  selector: "aed-asset-merge",
  templateUrl: "asset-merge.component.html",
  providers: [ConfirmationService],
  styles: []
})
export class AssetMergeComponent extends BaseComponent implements OnInit {
  workOrder: WorkOrderDetail;
  fromWorkOrderAsset: WorkOrderAsset;
  toWorkOrderAsset: WorkOrderAsset;
  workOrderId = "";

  constructor(
    private assetService: AssetService,
    private workOrderService: WorkOrderService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    protected location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(location);
  }

  ngOnInit(): void {
    this.workOrderId = this.activatedRoute.snapshot.params["workOrderId"];

    const workOrderAssetId = this.activatedRoute.snapshot.params[
      "workOrderAssetId"
    ];

    this.loading = true;

    console.log("getworkorder: " + new Date());
    this.workOrderService
      .getWorkOrder(this.workOrderId)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(workOrder => {
        console.log("gotworkorder: " + new Date());
        this.workOrder = workOrder;

        this.fromWorkOrderAsset = _.findWhere(this.workOrder.assets, {
          assetId: workOrderAssetId
        });

        if (!this.fromWorkOrderAsset) {
          this.errors.push({
            severity: "error",
            summary: "Merge Asset Error",
            detail: `Asset with id ${this.fromWorkOrderAsset.id} does not exist`
          });
        }

        this.workOrder.assets = _.filter(this.workOrder.assets, function(item) {
          return (
            item.id !== workOrderAssetId &&
            item.verificationStatus !== VerificationStatusType.New
          );
        });
      });
  }

  onAssetSelect(event) {
    this.toWorkOrderAsset = <WorkOrderAsset>event.data;
  }

  displayMergeButton() {
    return this.fromWorkOrderAsset && this.toWorkOrderAsset;
  }

  mergeAssets() {
    this.assetService
      .mergeAssets(this.fromWorkOrderAsset.id, this.toWorkOrderAsset.id)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        () => {
          let message = "Assets Successfully Merged//";
          message += `Assets [${this.fromWorkOrderAsset.name}] and [${this
            .toWorkOrderAsset.name}] have been successfully merged.`;

          this.workOrderService.successMessages.push(message);
          this.router.navigate(["workorder", this.workOrderId]);
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Merge Asset Error",
            detail: error
          });
        }
      );
  }

  buttonText() {
    return "Merge Assets";
  }

  confirm() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to merge these assets?",
      accept: () => {
        this.mergeAssets();
      }
    });
  }
}
