import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  AccordionModule,
  AutoCompleteModule,
  BreadcrumbModule,
  ButtonModule,
  CalendarModule,
  CarouselModule,
  ChartModule,
  CheckboxModule,
  ChipsModule,
  CodeHighlighterModule,
  ConfirmDialogModule,
  SharedModule,
  ContextMenuModule,
  DataGridModule,
  DataListModule,
  DataScrollerModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  DragDropModule,
  EditorModule,
  FieldsetModule,
  FileUploadModule,
  GalleriaModule,
  GMapModule,
  GrowlModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextModule,
  InputTextareaModule,
  LightboxModule,
  ListboxModule,
  MegaMenuModule,
  MenuModule,
  MenubarModule,
  MessagesModule,
  MultiSelectModule,
  OrderListModule,
  OverlayPanelModule,
  PaginatorModule,
  PanelModule,
  PanelMenuModule,
  PasswordModule,
  PickListModule,
  ProgressBarModule,
  RadioButtonModule,
  RatingModule,
  ScheduleModule,
  SelectButtonModule,
  SlideMenuModule,
  SliderModule,
  SpinnerModule,
  SplitButtonModule,
  StepsModule,
  TabMenuModule,
  TabViewModule,
  TerminalModule,
  TieredMenuModule,
  ToggleButtonModule,
  ToolbarModule,
  TooltipModule,
  TreeModule,
  TreeTableModule
} from "primeng/primeng";

import { AppComponent } from "./app.component";
import { MenuComponent, SubMenuComponent } from "./home/menu.component";
import { TopBarComponent } from "./home/topbar.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AssetListComponent } from "./assets/asset-list.component";
import { AssetHistoryListComponent } from "./assets/asset-history-list.component";
import { AssetSnapshotComponent } from "./assets/asset-snapshot.component";
import { AssetDetailViewComponent } from "./assets/asset-detail-view.component";
import { AssetDetailComponent } from "./assets/asset-detail.component";
import { AssetMergeComponent } from "./assets/asset-merge.component";
import { AssetFilesComponent } from "./assets/asset-files.component";
import { AssetRegisterComponent } from "./assets/asset-register.component";
import { BusinessComplianceItemDetailComponent } from "./compliance/business-compliance-item-detail.component";
import { BusinessSummaryListComponent } from "./businesses/business-summary-list.component";
import { BusinessDetailComponent } from "./businesses/business-detail.component";
import { BusinessDetailViewComponent } from "./businesses/business-detail-view.component";
import { BusinessInducteeDetailComponent } from "./businesses/business-inductee-detail.component";
import { BusinessInducteeListComponent } from "./businesses/business-inductee-list.component";
import { BusinessInducteeDetailViewComponent } from "./businesses/business-inductee-detail-view.component";
import { SiteSummaryListComponent } from "./sites/site-summary-list.component";
import { DashboardComponent } from "./home/dashboard.component";
import { PersonSummaryListComponent } from "./persons/person-summary-list.component";
import { PersonSummaryViewComponent } from "./persons/person-summary-view.component";
import { PersonDetailAddComponent } from "./persons/person-detail-add.component";
import { PersonDetailEditComponent } from "./persons/person-detail-edit.component";
import { PersonComplianceItemListComponent } from "./compliance/person-compliance-item-list.component";
import { PersonComplianceItemDetailComponent } from "./compliance/person-compliance-item-detail.component";
import { SiteDetailComponent } from "./sites/site-detail.component";
import { SiteDetailViewComponent } from "./sites/site-detail-view.component";
import { SiteObjectDetailViewComponent } from "./siteobjects/siteobject-detail-view.component";
import { SiteObjectDetailComponent } from "./siteobjects/siteobject-detail.component";
import { SiteObjectSummaryListComponent } from "./siteobjects/siteobject-summary-list.component";
import { ComplianceItemListComponent } from "./compliance/compliance-item-list.component";
import { BusinessComplianceItemListComponent } from "./compliance/business-compliance-item-list.component";
import { ComplianceItemDetailComponent } from "./compliance/compliance-item-detail.component";
import { ComplianceItemDetailViewComponent } from "./compliance/compliance-item-detail-view.component";
import { ComplianceItemSelectableComponent } from "./compliance/compliance-item-selectable.component";
import { WorkInstructionListComponent } from "./workinstructions/workinstruction-list.component";
import { WorkInstructionDetailComponent } from "./workinstructions/workinstruction-detail.component";
import { WorkInstructionDetailViewComponent } from "./workinstructions/workinstruction-detail-view.component";
import { WorkInstructionTaskListComponent } from "./workinstructions/workinstructiontask-list.component";
import { AssetTypeSelectableComponent } from "./assettypes/assettype-selectable.component";
import { AssetTypeDetailComponent } from "./assettypes/assettype-detail.component";
import { ContractSummaryListComponent } from "./contracts/contract-summary-list.component";
import { ContractDetailComponent } from "./contracts/contract-detail.component";
import { ContractDetailViewComponent } from "./contracts/contract-detail-view.component";
import { WorkOrderListComponent } from "./workorders/workorder-list.component";
import { WorkOrderDetailComponent } from "./workorders/workorder-detail.component";
import { WorkOrderDetailViewComponent } from "./workorders/workorder-detail-view.component";
import { AssetClassListComponent } from "./assetclasses/assetclass-list.component";
import { AssetClassRegisterComponent } from "./assetclasses/assetclass-register.component";
import { ReportsComponent } from "./reports/reports.component";
import { LegacyIdentityListComponent } from "./assets/legacyidentity-list.component";
import { ManufacturerSummaryListComponent } from "./manufacturers/manufacturer-summary-list.component";
import { ManufacturerDetailComponent } from "./manufacturers/manufacturer-detail.component";
import { ManufacturerDetailViewComponent } from "./manufacturers/manufacturer-detail-view.component";
import { WorkOrderAssetsTotalsComponent } from "./workorders/workorderassets-totals.component";

import { AppRouting } from "./app.routing";
import { PageNotFoundComponent } from "./page-not-found.component";

import { AuthHttp } from "./services/auth.http";
import { DateTimeService } from "./services/datetime.service";

import { BaseService } from "./services/base.service";
import { AuthService } from "./services/auth.service";
import { AssetService } from "./services/asset.service";
import { BusinessService } from "./services/business.service";
import { DashboardService } from "./services/dashboard.service";
import { SiteService } from "./services/site.service";
import { PersonService } from "./services/person.service";
import { SiteObjectService } from "./services/siteobject.service";
import { ValidatorService } from "./services/validator.service";
import { ComplianceItemService } from "./services/compliance.service";
import { ModelService } from "./services/model.service";
import { BarcodeService } from "./services/barcode.service";
import { WorkInstructionService } from "./services/workinstruction.service";
import { WorkOrderService } from "./services/workorder.service";
import { ContractService } from "./services/contract.service";
import { InducteeService } from "./services/inductee.service";

import { AuthGuard } from "./services/auth.guard";

import { KeysPipe } from "./pipes/keys.pipe";

import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SubMenuComponent,
    TopBarComponent,
    PageNotFoundComponent,
    HomeComponent,
    LoginComponent,
    AssetListComponent,
    AssetHistoryListComponent,
    AssetSnapshotComponent,
    AssetDetailViewComponent,
    AssetDetailComponent,
    AssetFilesComponent,
    AssetRegisterComponent,
    AssetMergeComponent,
    BusinessSummaryListComponent,
    BusinessDetailComponent,
    BusinessDetailViewComponent,
    BusinessInducteeDetailComponent,
    BusinessInducteeDetailViewComponent,
    BusinessInducteeListComponent,
    DashboardComponent,
    SiteSummaryListComponent,
    PersonSummaryListComponent,
    PersonSummaryViewComponent,
    PersonDetailAddComponent,
    PersonDetailEditComponent,
    PersonComplianceItemListComponent,
    PersonComplianceItemDetailComponent,
    SiteDetailComponent,
    SiteDetailViewComponent,
    SiteObjectSummaryListComponent,
    SiteObjectDetailComponent,
    SiteObjectDetailViewComponent,
    ComplianceItemListComponent,
    BusinessComplianceItemListComponent,
    ComplianceItemDetailComponent,
    ComplianceItemDetailViewComponent,
    ComplianceItemSelectableComponent,
    WorkInstructionListComponent,
    WorkInstructionDetailComponent,
    WorkInstructionDetailViewComponent,
    WorkInstructionTaskListComponent,
    AssetTypeSelectableComponent,
    AssetTypeDetailComponent,
    ContractSummaryListComponent,
    ContractDetailComponent,
    ContractDetailViewComponent,
    WorkOrderListComponent,
    WorkOrderDetailComponent,
    WorkOrderDetailViewComponent,
    AssetClassListComponent,
    AssetClassRegisterComponent,
    ReportsComponent,
    LegacyIdentityListComponent,
    ManufacturerSummaryListComponent,
    ManufacturerDetailComponent,
    ManufacturerDetailViewComponent,
    WorkOrderAssetsTotalsComponent,
    BusinessComplianceItemDetailComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRouting,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule
  ],
  providers: [
    DateTimeService,
    AuthHttp,
    AuthService,
    DashboardService,
    AssetService,
    BusinessService,
    SiteObjectService,
    SiteService,
    PersonService,
    ValidatorService,
    ComplianceItemService,
    ModelService,
    BarcodeService,
    WorkInstructionService,
    WorkOrderService,
    ContractService,
    InducteeService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: "/" },
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
