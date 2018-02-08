import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { SelectItem } from "primeng/primeng";
import { BusinessSummary } from "app/models/business/business-summary";
import { WorkOrderAsset } from "app/models/assets/asset";

export class WorkOrderDetail extends BaseModel {

  public types: SelectItem[] = [];
  public statusTypes: SelectItem[] = [];
  public businesses: BusinessSummary[] = [];
  public tradeTypes: SelectItem[] = [];
  public priorityTypes: SelectItem[] = [];
  public assets: WorkOrderAsset[] = [];
  public assetClasses: WorkOrderAssetClass[] = [];

  constructor(
    public id = "",
    public createdDate = new Date(),
    public requiredDate?: Date,
    public startDate?: Date,
    public completedDate?: Date,
    public active = true,
    public name = "",
    public identity = "",
    public description = "",
    public additionalInformation = "",
    public type: WorkOrderType = WorkOrderType.AssetAudit,
    public status: WorkOrderStatus = WorkOrderStatus.Requested,
    public trade: WorkOrderTradeType = WorkOrderTradeType.Fire,
    public priority: WorkOrderPriorityType = WorkOrderPriorityType.Routine,
    public assetId = "",
    public assetName = "",
    public assetIdentity = "",
    public hasAssetDetails = false,
    public businessId = "",
    public businessName = "",
    public personId = "",
    public resource = "",
    public siteId = "",
    public siteName = "",
    public siteIdentity = "",
    public siteObjectId = "",
    public siteObjectName = "",
    public siteObjectIdentity = "",
    public assetClassLevelOneName = ""
  ) {
    super();

    this.types = super.getSelectItemsFromEnum(WorkOrderType);
    this.statusTypes = super.getSelectItemsFromEnum(WorkOrderStatus);
    this.tradeTypes = super.getSelectItemsFromEnum(WorkOrderTradeType);
    this.priorityTypes = super.getSelectItemsFromEnum(WorkOrderPriorityType);
  }

  typeString(): string {
    return this.camelCaseToSpaces(WorkOrderType[this.type]);
  }

  priorityString(): string {
    return this.camelCaseToSpaces(WorkOrderPriorityType[this.priority]);
  }

  statusString(): string {
    return this.camelCaseToSpaces(WorkOrderStatus[this.status]);
  }

  hasAssetDetailsDisplay(): string {
    if (this.hasAssetDetails) {
      return "Yes";
    }

    return "No";
  }
}

export class WorkOrderAssetClass {
  constructor(
    public workOrderId = "",
    public workOrderName = "",
    public assetClassId = "",
    public assetClassName = "") {

    }
}

export enum WorkOrderTradeType {
  Electrical,
  Fire,
  Gas,
  Mechanical,
  Plumbing
}

export enum WorkOrderType {
  Repairs = 0,
  AssetAudit,
  WorkAudit,
  ConditionAssessment,
  Service,
  Installation,
  Exchange,
  Removal,
  General
}

export enum WorkOrderStatus {
  Requested = 0,
  QuoteRequired,
  QuoteSubmitted,
  QuoteRejected,
  ApprovedOnHold,
  Approved,
  WorkAllocated,
  WorkScheduled,
  WorkRejected,
  InTransit,
  InProgress,
  InProgressOnHold,
  Cancelled,
  WorkCompleted,
  Finalised
}

export enum WorkOrderPriorityType {
  Emergency,
  Urgent,
  Important,
  Low,
  Routine
}
