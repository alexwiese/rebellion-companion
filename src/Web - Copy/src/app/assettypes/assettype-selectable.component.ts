import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AssetType } from "app/models/assets/asset";
import { BaseComponent } from "../shared/base.component";
import {
  Dropdown,
  AutoComplete
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
  selector: "aed-assettype-selectable",
  templateUrl: "assettype-selectable.component.html",
  styles: [`.label { padding: 10px; margin-right: 10px; cursor: pointer; }`]
})

export class AssetTypeSelectableComponent extends BaseComponent implements OnInit {
  filteredAssetTypes: AssetType[] = [];

  @Input() assetTypes: AssetType[] = [];
  @Input() selectedAssetTypes: AssetType[] = [];

  @Output() onAssetTypeSelected: EventEmitter<AssetType>
  = new EventEmitter<AssetType>();

  @Output() onAssetTypeUnselected: EventEmitter<AssetType>
  = new EventEmitter<AssetType>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = false;
    this.filteredAssetTypes = this.assetTypes;
  }

  filterAssetTypes(event: any) {
    this.filteredAssetTypes = [];
    for (let i = 0; i < this.assetTypes.length; i++) {
      const item = this.assetTypes[i];
      if (item.name.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
        this.filteredAssetTypes.push(item);
      }
    }
  }

  handleDropdownClick(event: any) {
    this.filteredAssetTypes = this.assetTypes;
  }

  handleOnBlur(event: any) {
    this.filteredAssetTypes = this.assetTypes;
  }

  selectAssetType(event: any): void {
    this.filteredAssetTypes = this.assetTypes;
    this.onAssetTypeSelected.emit(event);
  }

  unselectAssetType(event: any): void {
    this.filteredAssetTypes = this.assetTypes;
    this.onAssetTypeUnselected.emit(event);
  }
}
