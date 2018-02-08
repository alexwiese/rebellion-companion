import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkOrderService } from "../services/workorder.service";
import { BaseComponent } from "../shared/base.component";
import { WorkOrderDetail } from "../models/workorders/workorder-detail";
import {
  Panel,
  InputText,
  Button,
  Message,
  Messages,
  InputTextarea,
} from "primeng/primeng";

import * as moment from "moment";

@Component({
  selector: "aed-workorder-detail-view",
  templateUrl: "workorder-detail-view.component.html",
  styles: [`
    .workorder-container
    {
        border: gray 1px solid;
        padding: 10px;
        margin-bottom: 10px;
    }`]
})

export class WorkOrderDetailViewComponent extends BaseComponent implements OnInit {
  workOrder: WorkOrderDetail;

  constructor(private workOrderService: WorkOrderService,
    private activatedRoute: ActivatedRoute,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    const id = this.activatedRoute.snapshot.params["id"];

    this.workOrderService.getWorkOrder(id).subscribe((workOrder) => {
      this.workOrder = workOrder;
    },
      error => this.errors.push({ severity: "error", summary: "Work Order Error", detail: error }),
      () => {
        this.loading = false;
      }
    );
  }
}
