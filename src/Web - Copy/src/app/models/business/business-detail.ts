import { BaseModel } from "app/models/base-model";
import { SelectItem } from "primeng/primeng";
import { RegionType, CountryType } from "app/models/address/address";

export class BusinessDetail extends BaseModel {
    public businessTypes: SelectItem[] = [];
    public businessRoles: SelectItem[] = [];
    public industries: SelectItem[] = [];
    public regions: SelectItem[] = [];
    public countries: SelectItem[] = [];

    constructor(
        public id = "",
        public identity = "",
        public createdDate = new Date(),
        public name = "",
        public tradingName = "",
        public businessRole: BusinessRoleType = BusinessRoleType.AssetMaintainer,
        public businessType: BusinessType = BusinessType.Company,
        public industryType: IndustryType = IndustryType.Accomodation,
        public abn = "",
        public phone = "",
        public active = false,
        public streetAddressId = "",
        public streetAddressStreet = "",
        public streetAddressSuburb = "",
        public streetAddressPostCode = "",
        public streetAddressCountry: any = 0,
        public streetAddressRegion: any = 1,
        public mailAddressId = "",
        public mailAddressStreet = "",
        public mailAddressSuburb = "",
        public mailAddressPostCode = "",
        public mailAddressCountry: any = 0,
        public mailAddressRegion: any = 1) {
            super();

            this.countries = this.getSelectItemsFromEnum(CountryType);
            this.regions = super.getSelectItemsFromEnum(RegionType, false);
            this.businessTypes = super.getSelectItemsFromEnum(BusinessType);
            this.businessRoles = super.getSelectItemsFromEnum(BusinessRoleType);
            this.industries = super.getSelectItemsFromEnum(IndustryType);
    }

    streetRegionString(): string {
        return RegionType[this.streetAddressRegion];
    }

    streetCountryString(): string {
        return CountryType[this.streetAddressCountry];
    }

    mailRegionString(): string {
        return RegionType[this.streetAddressRegion];
    }

    mailCountryString(): string {
        return CountryType[this.streetAddressCountry];
    }

    streetAddressString(): string {
        return this.streetAddressStreet + ", " + this.streetAddressSuburb + ", "
            + this.streetAddressPostCode + ", " + this.streetRegionString() + ", " + this.streetCountryString();
    }

    mailAddressString(): string {
        return this.mailAddressStreet + ", " + this.mailAddressSuburb + ", "
            + this.mailAddressPostCode + ", " + this.mailRegionString() + ", " + this.mailCountryString();
    }

    businessRoleTypeString() {
        if (this.businessRole != null) {
            return this.camelCaseToSpaces(BusinessRoleType[this.businessRole]);
        }
        return "";
    }

    businessTypeString() {
        if (this.businessType != null) {
            return this.camelCaseToSpaces(BusinessType[this.businessType]);
        }

        return "";
    }

    industryTypeString() {
        if (this.industryType != null) {
            return this.camelCaseToSpaces(IndustryType[this.industryType]);
        }

        return "";
    }
}

export enum BusinessRoleType {
    AssetOwner = 0,
    AssetMaintainer,
    AssetOwnerAndMaintainer
}

export enum IndustryType {
    Retail = 0,
    Defence,
    Education,
    ServiceAndRepairs,
    Accomodation
}

export enum BusinessType {
    SoleTrader = 0,
    Company
}

