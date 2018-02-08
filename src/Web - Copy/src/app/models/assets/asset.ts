import { KeyValue } from "app/models/key-value";
import { BaseModel } from "app/models/base-model";
import { BusinessRoleType } from "app/models/business/business-detail";
import { SiteObjectType } from "app/models/siteobjects/siteobject-detail";
import { SelectItem } from "primeng/primeng";

export class AssetRelationship extends BaseModel {
  constructor(
    public businessName = "",
    public contactName = "",
    public businessRole: BusinessRoleType = BusinessRoleType.AssetOwner
  ) {
    super();
  }

  businessRoleString(): string {
    return this.camelCaseToSpaces(BusinessRoleType[this.businessRole]);
  }
}

export class SpecificAttribute {
  constructor(
    public name = "",
    public display = ""
  ) {
  }
}

export class AssetType extends BaseModel {
  public tradeTypes: SelectItem[] = [];

  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public description = "",
    public tradeType: TradeType = TradeType.Fire,
    public defaultWorkInstructionId = "",
    public canDelete = false,
    public assetNames = "",
    public specificAttributes: string[] = []
  ) {
    super();

    this.tradeTypes = super.getSelectItemsFromEnum(TradeType);
  }
}

export class AssetFile extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public fileName = "",
    public fileSource = "",
    public originalFileName = "",
    public fileType = "",
    public assetName = "",
    public assetId = "",
    public absoluteUri: any
  ) {
    super();
  }
}

export class AssetClass extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public description = "",
    public breadCrumb = "",
    public level = 1,
    public assetTypeId = "",
    public assetTypeName = "",
    public canDelete = true,
    public parentAssetClassId = ""
  ) {
    super();
  }
}

export class AssetBase extends BaseModel {
  public getAssetConditionString(assetCondition: AssetConditionType): string {
    switch (assetCondition) {
      case 0:
        return "Inoperable";
      case 1:
        return "Very Poor - 0%";
      case 2:
        return "Very Poor - 3%";
      case 3:
        return "Poor - 5%";
      case 4:
        return "Poor - 15%";
      case 5:
        return "Average - 30%";
      case 6:
        return "Average - 50%";
      case 7:
        return "Good - 70%";
      case 8:
        return "Good - 80%";
      case 9:
        return "Excellent - 90%";
      case 10:
        return "Excellent - 100%";
      default:
        return "Inoperable";
    }
  }
}

export class LegacyIdentity extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public source = "",
    public owner = "",
    public assetId = ""
  ) {
    super();
  }
}

export class WorkOrderAsset extends AssetBase {
  public verificationStatusTypes: SelectItem[] = [];
  public assetStatusString = "";
  public assetCriticalityString = "";
  public assetConditionString = "";
  public maintenanceStrategyString = "";
  public verificationStatusString = "";
  public location = "";

  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public identity = "",
    public barcode = "",
    public serialNumber = "",
    public constructionTagNumber = "",
    public assetId = "",
    public workOrderId = "",
    public verificationStatus: VerificationStatusType = VerificationStatusType.NotFound,
    public assetStatus: AssetStatusType = AssetStatusType.InUse,
    public assetCriticality: AssetCriticalityType = AssetCriticalityType.High,
    public assetCondition: AssetConditionType = AssetConditionType.Average50,
    public maintenanceStrategy: MaintenanceStrategyType = MaintenanceStrategyType.ScheduledMaintenance,
    public assetTypeName = "",
    public locationLevel = "",
    public locationRoom = "",
    public locationDescription = "",
    public assetClassLevelOneName = "",
    public siteId = "",
    public siteObjectId = "",
    public assetTypeId = "",
    public maintenancePlanId = ""
  ) {
    super();

    this.assetStatusString = this.camelCaseToSpaces(AssetStatusType[this.assetStatus]);
    this.assetCriticalityString = this.camelCaseToSpaces(AssetCriticalityType[this.assetCriticality]);
    this.assetConditionString = this.getAssetConditionString(this.assetCondition);
    this.verificationStatusString = this.camelCaseToSpaces(VerificationStatusType[this.verificationStatus]);
    this.location = this.getLocation();
    this.verificationStatusTypes = super.getSelectItemsFromEnum(
      VerificationStatusType,
      true,
      false,
      ["New"]
    );
  }

  getLocation() {
    if (this.locationLevel && this.locationRoom) {
      return `${this.locationLevel} - ${this.locationRoom}`;
    }

    if (this.locationLevel) {
      return this.locationLevel;
    }

    if (this.locationRoom) {
      return this.locationRoom;
    }

    return "";
  }
}

export enum VerificationStatusType {
  Found = 0,
  NotFound,
  New
}

export class AssetSummary extends AssetBase {
  public assetStatusString = "";
  public assetCriticalityString = "";
  public assetConditionString = "";
  public maintenanceStrategyString = "";
  public siteObjectDescription = "";
  public siteDescription = "";

  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public identity = "",
    public assetStatus: AssetStatusType = AssetStatusType.InUse,
    public assetCriticality: AssetCriticalityType = AssetCriticalityType.High,
    public assetCondition: AssetConditionType = AssetConditionType.Average50,
    public siteId = "",
    public siteName = "",
    public siteIdentity = "",
    public siteAddress = "",
    public siteObjectId = "",
    public siteObjectName = "",
    public siteObjectIdentity = "",
    public siteObjectTypeName = "",
    public assetClassName = "",
    public assetClassLevelOneName = "",
    public assetTypeName = "",
    public businessId = "",
    public level = "",
    public room = ""
  ) {
    super();

    this.assetStatusString = this.camelCaseToSpaces(
      AssetStatusType[this.assetStatus]
    );
    this.assetCriticalityString = this.camelCaseToSpaces(
      AssetCriticalityType[this.assetCriticality]
    );
    this.assetConditionString = this.getAssetConditionString(
      this.assetCondition
    );
    this.siteObjectDescription = this.setSiteObjectDescription();
    this.siteDescription = this.setSiteDescription();
  }

  setSiteDescription(): string {
    return `${this.siteIdentity} (${this.siteAddress})`;
  }

  setSiteObjectDescription(): string {
    if (!this.siteObjectIdentity) {
      return "";
    }

    return `${this.siteObjectIdentity} (${this.siteObjectName})`;
  }
}

export class AssetSnapshot extends AssetSummary {

}

export class AssetHistory extends AssetBase {
  public assetStatusString = "";
  public assetCriticalityString = "";
  public assetConditionString = "";
  public lastVerifiedStatusString = "";

  constructor(
    public id = "",
    public createdDate: Date = new Date(),
    public name = "",
    public identity = "",
    public description = "",
    public serialNumber = "",
    public constructionTagNumber = "",
    public barcode = "",
    public assetStatus: AssetStatusType = AssetStatusType.InUse,
    public assetCriticality: AssetCriticalityType = AssetCriticalityType.High,
    public assetCondition: AssetConditionType = AssetConditionType.Average50,
    public maintenanceStrategy: MaintenanceStrategyType = MaintenanceStrategyType.PerformanceBasedMaintenance,
    public maintenancePlanId = "",
    public baseDate: Date = new Date(),
    public locationLevel = "",
    public locationRoom = "",
    public locationDescription = "",
    public longitude: number = null,
    public latitude: number = null,
    public assetTypeId = "",
    public siteId = "",
    public siteObjectId = "",
    public businessId = "",
    public heirarchy = "",
    public lastVerifiedBy = "",
    public lastVerifiedDate?: Date,
    public lastVerifiedStatus?: VerificationStatusType,
    public assetClassId = "",
    public businessName = ""
  ) {
    super();

    this.assetStatusString = this.camelCaseToSpaces(AssetStatusType[this.assetStatus]);
    this.assetCriticalityString = this.camelCaseToSpaces(AssetCriticalityType[this.assetCriticality]);
    this.assetConditionString = this.getAssetConditionString(this.assetCondition);
    this.setLastVerifiedStatusString();
  }

  private setLastVerifiedStatusString() {
    if (!this.lastVerifiedStatus && this.lastVerifiedStatus !== 0) {
      this.lastVerifiedStatusString = "";
    } else {
      this.lastVerifiedStatusString = this.camelCaseToSpaces(VerificationStatusType[this.lastVerifiedStatus]);
    }
  }
}

export class Asset extends AssetBase {
  public statusTypes: SelectItem[] = [];
  public criticalityTypes: SelectItem[] = [];
  public files: AssetFile[] = [];
  public legacyIdentities: LegacyIdentity[] = [];
  public maintenanceStrategyTypes: SelectItem[] = [];

  public assetStatusString = "";
  public assetCriticalityString = "";
  public assetConditionString = "";
  public maintenanceStrategyString = "";
  public lastVerifiedStatusString = "";

  constructor(
    public id = "",
    public createdDate: Date = new Date(),
    public name = "",
    public identity = "",
    public description = "",
    public serialNumber = "",
    public constructionTagNumber = "",
    public barcode = "",
    public assetStatus: AssetStatusType = AssetStatusType.InUse,
    public assetCriticality: AssetCriticalityType = AssetCriticalityType.High,
    public assetCondition: AssetConditionType = AssetConditionType.Average50,
    public maintenanceStrategy: MaintenanceStrategyType = MaintenanceStrategyType.PerformanceBasedMaintenance,
    public maintenancePlanName = "",
    public maintenancePlanId = "",
    public baseDate: Date = new Date(),
    public locationLevel = "",
    public locationRoom = "",
    public locationDescription = "",
    public longitude: number = null,
    public latitude: number = null,
    public assetTypeId = "",
    public assetTypeName = "",
    public siteId = "",
    public siteObjectId = "",
    public siteName = "",
    public siteObjectName = "",
    public businessId = "",
    public heirarchy = "",
    public lastVerifiedBy = "",
    public lastVerifiedDate?: Date,
    public lastVerifiedStatus?: VerificationStatusType,
    public assetClassId = "",
    public manufacturedDate?: Date,
    public installationDate?: Date,
    public commissioningDate?: Date,
    public equipmentAge = 0.0,
    public equipmentLocationAge = 0.0
  ) {
    super();

    this.statusTypes = super.getSelectItemsFromEnum(AssetStatusType);
    this.criticalityTypes = super.getSelectItemsFromEnum(AssetCriticalityType);
    this.maintenanceStrategyTypes = super.getSelectItemsFromEnum(MaintenanceStrategyType, true, true);
    this.assetStatusString = this.camelCaseToSpaces(AssetStatusType[this.assetStatus]);
    this.assetCriticalityString = this.camelCaseToSpaces(AssetCriticalityType[this.assetCriticality]);
    this.assetConditionString = this.getAssetConditionString(this.assetCondition);
    this.setMaintenanceStategyString();
    this.setLastVerifiedStatusString();
  }

  private setMaintenanceStategyString() {
    if (!this.maintenanceStrategy) {
      this.maintenanceStrategyString = "";
    } else {
      this.maintenanceStrategyString = this.camelCaseToSpaces(MaintenanceStrategyType[this.maintenanceStrategy]);
    }
  }

  private setLastVerifiedStatusString() {
    if (!this.lastVerifiedStatus) {
      this.lastVerifiedStatusString = "";
    } else {
      this.lastVerifiedStatusString = this.camelCaseToSpaces(VerificationStatusType[this.lastVerifiedStatus]);
    }
  }
}

export enum AssetStatusType {
  Disposed = 0,
  InStorage,
  InUse,
  NotInUse,
  UnderConstruction
}

export enum AssetCriticalityType {
  Low = 0,
  Medium,
  High
}

export enum TradeType {
  Electrical,
  Fire,
  Gas,
  Mechanical,
  Plumbing
}

export enum MaintenanceStrategyType {
  PerformanceBasedMaintenance = 0,
  ResponsiveMaintenance,
  ScheduledMaintenance,
  PredictiveMaintenance
}

export enum AssetConditionType {
  Inoperable = 0,
  VeryPoor0,
  VeryPoor3,
  Poor5,
  Poor15,
  Average30,
  Average50,
  Good70,
  Good80,
  Excellent90,
  Excellent100
}
