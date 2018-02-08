import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Asset, AssetSummary, AssetStatusType, AssetConditionType } from "../models/assets/asset";
import { SiteObjectType } from "app/models/siteobjects/siteobject-detail";
import { AssetService } from "app/services/asset.service";
import { BusinessService } from "app/services/business.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { RoleType } from "app/models/people/person";
import { AuthService } from "app/services/auth.service";
import { PagerComponent } from "app/shared/pager.component";
import { DataTable, SharedModule, Button, Message, SelectItem, MenuItem } from "primeng/primeng";
import * as _ from "underscore";
import "rxjs/add/operator/mergeMap";

@Component({
    selector: "aed-asset-list",
    templateUrl: "./asset-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }
    .ui-datatable table { font-size: 12px; }`]
})

export class AssetListComponent extends PagerComponent<AssetSummary> implements OnInit {
    @Input() siteId = "";
    @Input() showBusinessFilterSection = true;
    @Input() siteIdRequired = false;

    allAssets: AssetSummary[] = [];
    sites: SelectItem[] = [];
    assetTypes: SelectItem[] = [];
    statusTypes: SelectItem[] = [];
    conditionTypes: SelectItem[] = [];
    conditionObjectDescriptions: SelectItem[] = [];
    siteObjectDescriptions: SelectItem[] = [];
    siteObjectTypes: SelectItem[] = [];
    businesses: SelectItem[] = [];
    assetMenuItems: MenuItem[];
    selectedBusiness = "";

    constructor(private assetService: AssetService,
        private siteObjectService: SiteObjectService,
        private businessService: BusinessService,
        private authService: AuthService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.searchAssets();

        this.assetMenuItems = [
            { label: "Asset", icon: "fa-plus", routerLink: ["/asset/add", this.siteId] },
            { label: "Work Order", icon: "fa-plus", routerLink: ["/workorder/add/", ""] }
        ];

        if (this.authService.hasPersmission(RoleType.Maintainer)) {
            this.assetMenuItems.push({ label: "Contract", icon: "fa-plus", routerLink: ["/contract/add"] });
        }
    }

    showBusinessFilter() {
        return this.showBusinessFilterSection && this.authService.isAdmin();
    }

    onBusinessChange(event) {
        if (event.value) {
            const assetsForBusiness = _.filter(this.allAssets, (a) => {
                return a.businessId === event.value;
            })
            this.items = assetsForBusiness;
        } else {
            this.items = this.allAssets;
        }
    }

    searchAssets() {
        this.loading = true;
        this.errors = [];

        const getAllAssets = !this.siteId && !this.siteIdRequired;

        this.assetService.filterAssets(this.siteId, getAllAssets).finally(() => {
            this.loading = false;
        }).flatMap((assets: AssetSummary[]) => {
            this.allAssets = assets;
            this.items = assets;
            this.numberOfItems = assets.length;

            this.setSites(this.items);
            this.setAssetTypes(this.items);
            this.setStatusTypes();
            this.setConditionTypes();
            this.setSiteObjectDescriptions(this.items);
            this.setSiteObjectTypes();

            return this.businessService.getBusinesses();
        }).subscribe((businesses) => {
            this.setDefaultObject(this.businesses);
            businesses.forEach((s) => {
                this.businesses.push({ label: s.name, value: s.id });
            });
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Asset Error", detail: error });
        });
    }

    setAssetTypes(assets: AssetSummary[]) {
        const assetTypeNames = _.uniq(_.pluck(assets, "assetTypeName"));
        assetTypeNames.forEach((s) => {
            this.assetTypes.push({ label: s, value: s });
        });
    }

    setSites(assets: AssetSummary[]) {
        const siteNames = _.sortBy(_.uniq(_.pluck(assets, "siteName")));
        siteNames.forEach((s) => {
            this.sites.push({ label: s, value: s });
        });
    }

    setSiteObjectDescriptions(assets: AssetSummary[]) {
        const descriptions = _.sortBy(_.uniq(_.pluck(assets, "siteObjectDescription")));
        descriptions.forEach((s) => {
            this.siteObjectDescriptions.push({ label: s, value: s });
        });
    }

    setStatusTypes() {
        this.statusTypes = this.assetService.getAssetStatusSelectItems();
    }

    setConditionTypes() {
        this.conditionTypes = this.assetService.getAssetConditionSelecItems();
    }

    setSiteObjectTypes() {
        this.siteObjectTypes = this.siteObjectService.getSiteObjectTypeSelecItems();
    }
}
