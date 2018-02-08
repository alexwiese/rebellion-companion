import { PersonComplianceItemHeld } from "./models/compliance/compliance-detail";
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AssetListComponent } from "./assets/asset-list.component";
import { AssetSnapshotComponent } from "./assets/asset-snapshot.component";
import { AssetHistoryListComponent } from "./assets/asset-history-list.component";
import { AssetDetailViewComponent } from "./assets/asset-detail-view.component";
import { AssetDetailComponent } from "./assets/asset-detail.component";
import { AssetRegisterComponent } from "./assets/asset-register.component";
import { AssetMergeComponent } from "./assets/asset-merge.component";
import { BusinessSummaryListComponent } from "./businesses/business-summary-list.component";
import { BusinessDetailComponent } from "./businesses/business-detail.component";
import { BusinessDetailViewComponent } from "./businesses/business-detail-view.component";
import { BusinessInducteeDetailComponent } from "./businesses/business-inductee-detail.component";
import { BusinessInducteeDetailViewComponent } from "./businesses/business-inductee-detail-view.component";
import { PersonSummaryListComponent } from "./persons/person-summary-list.component";
import { PersonSummaryViewComponent } from "./persons/person-summary-view.component";
import { PersonDetailAddComponent } from "./persons/person-detail-add.component";
import { PersonDetailEditComponent } from "./persons/person-detail-edit.component";
import { SiteDetailComponent } from "./sites/site-detail.component";
import { SiteDetailViewComponent } from "./sites/site-detail-view.component";
import { SiteObjectDetailViewComponent } from "./siteobjects/siteobject-detail-view.component";
import { SiteObjectDetailComponent } from "./siteobjects/siteobject-detail.component";
import { SiteObjectSummaryListComponent } from "./siteobjects/siteobject-summary-list.component";
import { BusinessComplianceItemListComponent } from "./compliance/business-compliance-item-list.component";
import { PersonComplianceItemListComponent } from "./compliance/person-compliance-item-list.component";
import { PersonComplianceItemDetailComponent } from "./compliance/person-compliance-item-detail.component";
import { BusinessComplianceItemDetailComponent } from "./compliance/business-compliance-item-detail.component";
import { ComplianceItemListComponent } from "./compliance/compliance-item-list.component";
import { ComplianceItemDetailComponent } from "./compliance/compliance-item-detail.component";
import { ComplianceItemDetailViewComponent } from "./compliance/compliance-item-detail-view.component";
import { WorkInstructionListComponent } from "./workinstructions/workinstruction-list.component";
import { WorkInstructionDetailComponent } from "./workinstructions/workinstruction-detail.component";
import { WorkInstructionDetailViewComponent } from "./workinstructions/workinstruction-detail-view.component";
import { WorkInstructionTaskListComponent } from "./workinstructions/workinstructiontask-list.component";
import { ContractSummaryListComponent } from "./contracts/contract-summary-list.component";
import { ContractDetailComponent } from "./contracts/contract-detail.component";
import { ContractDetailViewComponent } from "./contracts/contract-detail-view.component";
import { WorkOrderListComponent } from "./workorders/workorder-list.component";
import { WorkOrderDetailComponent } from "./workorders/workorder-detail.component";
import { WorkOrderDetailViewComponent } from "./workorders/workorder-detail-view.component";
import { AssetClassListComponent } from "./assetclasses/assetclass-list.component";
import { AssetClassRegisterComponent } from "./assetclasses/assetclass-register.component";
import { ReportsComponent } from "./reports/reports.component";
import { ManufacturerSummaryListComponent } from "./manufacturers/manufacturer-summary-list.component";
import { ManufacturerDetailComponent } from "./manufacturers/manufacturer-detail.component";
import { ManufacturerDetailViewComponent } from "./manufacturers/manufacturer-detail-view.component";

import { AuthGuard } from "./services/auth.guard";

import { PageNotFoundComponent } from "./page-not-found.component";

const appRoutes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "home",
        redirectTo: "",
        canActivate: [AuthGuard]
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "assetlist",
        component: AssetListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "assetregister",
        component: AssetRegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "assetsnapshot",
        component: AssetSnapshotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/edit/:id",
        component: AssetDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/add",
        component: AssetDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/add/:siteId",
        component: AssetDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/:id/histories",
        component: AssetHistoryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorderasset/add/:siteId/:siteObjectId/:workOrderId",
        component: AssetDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/view/:id",
        component: AssetDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "asset/merge/:workOrderId/:workOrderAssetId",
        component: AssetMergeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "peoplelist",
        component: PersonSummaryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "people/add",
        component: PersonDetailAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "people/add/:businessId",
        component: PersonDetailAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "people/:id",
        component: PersonDetailEditComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "people/:id/view",
        component: PersonSummaryViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "manufacturerlist",
        component: ManufacturerSummaryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "manufacturer/add",
        component: ManufacturerDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "manufacturer/:id",
        component: ManufacturerDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "manufacturer/:id/view",
        component: ManufacturerDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "businesslist",
        component: BusinessSummaryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/add",
        component: BusinessDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:id",
        component: BusinessDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:id/view",
        component: BusinessDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:businessId/site/:id",
        component: SiteDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:businessId/inductee/:personId",
        component: BusinessInducteeDetailComponent,
        canActivate: [AuthGuard]
    }
    ,
    {
        path: "businessinductees/:id",
        component: BusinessInducteeDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "businessinductees/:id/view",
        component: BusinessInducteeDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "site/add/:businessId",
        component: SiteDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "site/:id/view",
        component: SiteDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:businessId/site/:id/view",
        component: SiteDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:businessId/site/:siteId/siteobject/:id",
        component: SiteObjectDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "business/:businessId/site/:siteId/siteobject/:id/view",
        component: SiteObjectDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "siteobject/:id/view",
        component: SiteObjectDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "siteobject/add/:siteId/:siteObjectType",
        component: SiteObjectDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "siteobjectlist",
        component: SiteObjectSummaryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "reportlist",
        component: AssetListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "enquirylist",
        component: AssetListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "complianceitemlist",
        component: ComplianceItemListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "personcomplianceitemlist/:personId",
        component: PersonComplianceItemListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "personcomplianceitemheld/:id",
        component: PersonComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "personcomplianceitemheld/add/:personId",
        component: PersonComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "businesscomplianceitemlist/:businessId",
        component: BusinessComplianceItemListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "businesscomplianceitemheld/:id",
        component: BusinessComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "businesscomplianceitemheld/add/:businessId",
        component: BusinessComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "complianceitem/add",
        component: ComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "complianceitem/:id",
        component: ComplianceItemDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "complianceitem/:id/view",
        component: ComplianceItemDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workinstructionlist",
        component: WorkInstructionListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workinstruction/add",
        component: WorkInstructionDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workinstruction/:id",
        component: WorkInstructionDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workinstruction/:id/view",
        component: WorkInstructionDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "contracts",
        component: ContractSummaryListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "contract/add",
        component: ContractDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "contract/:id",
        component: ContractDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "contract/:id/view",
        component: ContractDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorderlist",
        component: WorkOrderListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorderlist/:assetId",
        component: WorkOrderListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorder/:id",
        component: WorkOrderDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorder/:id/view",
        component: WorkOrderDetailViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "workorder/add/:assetId",
        component: WorkOrderDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "assetclasslist",
        component: AssetClassListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "assetclassregister",
        component: AssetClassRegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "reportsdemo",
        component: ReportsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }
];

export const AppRoutingProviders: any[] = [
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
