import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AssetHistory } from "../models/assets/asset";
import { AssetService } from "app/services/asset.service";
import { AuthService } from "app/services/auth.service";
import { PagerComponent } from "app/shared/pager.component";
import {
  DataTable,
  SharedModule,
  Button,
  Message,
  SelectItem,
  MenuItem
} from "primeng/primeng";
import * as _ from "underscore";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: "aed-asset-history-list",
  templateUrl: "./asset-history-list.component.html",
  styles: [
    `.label { cursor: pointer; padding: 5px; }
    .ui-datatable table { font-size: 12px; }`
  ]
})
export class AssetHistoryListComponent extends PagerComponent<AssetHistory>
  implements OnInit {
  @Input() id = "";

  constructor(
    private assetService: AssetService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected location: Location
  ) {
    super(location);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params["id"];

    this.searchAssetHistories(id);
  }

  searchAssetHistories(id: string) {
    this.loading = true;
    this.errors = [];

    this.assetService
      .getAssetHistories(id)
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
            summary: "Asset Histories Error",
            detail: error
          });
        }
      );
  }
}
