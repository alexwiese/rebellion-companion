import { Component, Input, OnInit } from "@angular/core";
import { PagerComponent } from "../shared/pager.component";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { WorkOrderDetail } from "../models/workorders/workorder-detail";
import { WorkOrderService } from "../services/workorder.service";
import * as _ from "underscore";

@Component({
    selector: "aed-workorder-list",
    templateUrl: "./workorder-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }
    .ui-datatable table { font-size: 12px; }`]
})

export class WorkOrderListComponent extends PagerComponent<WorkOrderDetail> implements OnInit {

    @Input() assetId = null;

    constructor(private workOrderService: WorkOrderService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.getAssetIdFromUrlParams();
        this.searchItems();
    }

    getAssetIdFromUrlParams() {
        const assetId = this.activatedRoute.snapshot.params["assetId"];

        if (assetId) {
            this.assetId = assetId;
        }
    }

    searchItems() {
        this.loading = true;

        if (this.assetId) {
            this.workOrderService.getWorkOrdersForAsset(this.assetId).finally(() => {
                this.loading = false;
                this.loaded = true;
            }).subscribe(
                (items: WorkOrderDetail[]) => {
                    this.setItems(items);
                },
                (error) => {
                    this.errors.push({ severity: "error", summary: "Work Orders Error", detail: error });
                    this.numberOfItems = 0;
                });
        } else {
            this.workOrderService.getWorkOrders().finally(() => {
                this.loading = false;
                this.loaded = true;
            }).subscribe(
                (items: WorkOrderDetail[]) => {
                    this.setItems(items);
                },
                (error) => {
                    this.errors.push({ severity: "error", summary: "Work Orders Error", detail: error });
                    this.numberOfItems = 0;
                });
        }
    }

    onSelect(item: WorkOrderDetail) {
        this.selectedItem = item;
    }
}
