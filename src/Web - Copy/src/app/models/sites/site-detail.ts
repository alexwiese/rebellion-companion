import { AddressModel } from "app/models/base-model";
import { ComplianceItemDetail } from "app/models/compliance/compliance-detail";
import { RegionType, CountryType } from "app/models/address/address";
import { SelectItem } from "primeng/primeng";
import { BaseModel } from "app/models/base-model";

export class SiteDetail extends AddressModel {
    public complianceItems: ComplianceItemDetail[] = [];
    public siteTypes: SelectItem[] = [];
    public files: SiteFile[] = [];
    public typeString = "";
    public stateString = "";

    constructor(
        public id = "",
        public active = true,
        public createdDate: Date = new Date(),
        public name = "",
        public code = "",
        public description = "",
        public parkingDetails = "",
        public accessDetails = "",
        public type: SiteType = SiteType.Agricultural,
        public identity = "",
        public businessName = "",
        public businessId = "",
        public safetyInstructionId = "",
        public safetyInstructionName = "",
        public addressId = "",
        public addressStreet = "",
        public addressSuburb = "",
        public addressPostCode = "",
        public addressRegion: RegionType = RegionType.ACT,
        public addressCountry: CountryType = CountryType.Australia
    ) {
        super(addressId, addressStreet, addressSuburb, addressPostCode, addressRegion, addressCountry);

        this.siteTypes = super.getSelectItemsFromEnum(SiteType);

        this.stateString = RegionType[this.addressRegion];

        this.typeString = this.camelCaseToSpaces(SiteType[this.type]);
    }
}

export enum SiteType {
    Agricultural = 0,
    Commercial,
    Residential,
    Medical,
    Educational,
    Government,
    Industrial,
    Defence,
    Entertainment,
    Transport
}

export class SiteFile extends BaseModel {
    constructor(
        public id = "",
        public createdDate = new Date(),
        public fileName = "",
        public fileSource = "",
        public originalFileName = "",
        public fileType = "",
        public siteName = "",
        public siteId = "",
        public absoluteUri: any
    ) {
        super();
    }
}

