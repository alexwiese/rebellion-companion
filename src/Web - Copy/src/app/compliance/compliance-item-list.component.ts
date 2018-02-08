import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ComplianceItemDetail } from "../models/compliance/compliance-detail";
import { ComplianceItemService } from "../services/compliance.service";
import { PagerComponent } from "app/shared/pager.component";
import * as _ from "underscore";

@Component({
  selector: "aed-compliance-item-list",
  templateUrl: "./compliance-item-list.component.html",
  styles: [`.label { cursor: pointer; padding: 5px; }`]
})
export class ComplianceItemListComponent extends PagerComponent<
  ComplianceItemDetail
> implements OnInit {
  constructor(
    private complianceItemService: ComplianceItemService,
    private router: Router,
    protected location: Location
  ) {
    super(location);
  }

  ngOnInit() {
    this.searchItems();
  }

  searchItems() {
    this.loading = true;
    this.complianceItemService.getComplianceItems().subscribe(
      (items: ComplianceItemDetail[]) => {
        this.setItems(items);
      },
      error => {
        this.errors.push({
          severity: "error",
          summary: "Site Object Error",
          detail: error
        });
        this.numberOfItems = 0;
      },
      () => {
        this.loading = false;
        this.loaded = false;
      }
    );
  }

  onSelect(item: ComplianceItemDetail) {
    this.selectedItem = item;
  }
}
