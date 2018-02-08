import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { SelectItem } from "primeng/primeng";

export class ComplianceItemDetail extends BaseModel {
    public types: SelectItem[] = [];
    public levels: SelectItem[] = [];
    public selected = false;

    constructor(
        public id = "",
        public createdDate = new Date(),
        public name = "",
        public active = true,
        public issuingAuthority = "",
        public type: ComplianceItemType = ComplianceItemType.License,
        public level: ComplianceLevelType = ComplianceLevelType.Mandatory) {
        super();

        this.types = super.getSelectItemsFromEnum(ComplianceItemType);
        this.levels = super.getSelectItemsFromEnum(ComplianceLevelType);
    }

    typeString(): string {
        return this.camelCaseToSpaces(ComplianceItemType[this.type]);
    }

    levelString(): string {
        return this.camelCaseToSpaces(ComplianceLevelType[this.level].replace(/([A-Z])/g, " $1"));
    }
}

export class BusinessComplianceItemHeld extends BaseModel {
    public complianceItems: SelectItem[] = [];
    public typeString = "";

    constructor(
        public id = "",
        public createdDate = new Date(),
        public active = true,
        public complianceItemId = "",
        public complianceItemName = "",
        public businessId = "",
        public reference = "",
        public startDate = new Date(),
        public expiryDate = new Date(),
        public isVerified = false,
        public type: ComplianceItemType = ComplianceItemType.License,
        public fileDisplayUri = "",
        public verifiedBy = "",
        public verifiedDate?: Date) {
        super();

        this.typeString = this.camelCaseToSpaces(ComplianceItemType[this.type]);
    }
}

export class PersonComplianceItemHeld extends BaseModel {
    public complianceItems: SelectItem[] = [];
    public typeString = "";

    constructor(
        public id = "",
        public createdDate = new Date(),
        public active = true,
        public complianceItemId = "",
        public complianceItemName = "",
        public personId = "",
        public reference = "",
        public startDate = new Date(),
        public expiryDate = new Date(),
        public isVerified = false,
        public type: ComplianceItemType = ComplianceItemType.License,
        public fileDisplayUri = "",
        public verifiedBy = "",
        public verifiedDate?: Date) {
        super();

        this.typeString = this.camelCaseToSpaces(ComplianceItemType[this.type]);
    }
}

export enum ComplianceItemType {
    License,
    Security,
    Safety,
    Skill,
    Insurance
}

export enum ComplianceLevelType {
    Mandatory,
    SupervisionAllowed
}

