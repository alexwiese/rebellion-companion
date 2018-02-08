import { AddressModel } from "app/models/base-model";
import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { SelectItem } from "primeng/primeng";

export class SiteObjectDetail extends AddressModel {

  public types: SelectItem[] = [];
  public buildingTypes: SelectItem[] = [];

  constructor(
    public id = "",
    public createdDate = new Date(),
    public name = "",
    public code = "",
    public identity = "",
    public legacyId = "",
    public type: SiteObjectType,
    public buildingType: BuildingType,
    public numberOfFloors = 0,
    public netLettableArea = 0.0,
    public totalFloorArea = 0.0,
    public pointOfContactName = "",
    public contactNumber = "",
    public parkingDetails = "",
    public additionalInformation = "",
    public siteId = "",
    public siteName = "",
    public businessId = "",
    public businessName = "",
    public active = true,
    public address: any) {

    super(address.addressId || "", address.addressStreet || "", address.addressSuburb || "",
      address.addressPostCode || "", address.addressRegion || 1, address.addressCountry || 0);

    this.types = super.getSelectItemsFromEnum(SiteObjectType);
    this.buildingTypes = super.getSelectItemsFromEnum(BuildingType);
  }

  typeString() {
    if (this.type !== null) {
      return this.camelCaseToSpaces(SiteObjectType[this.type]);
    }

    return "";
  }

  buildingTypeString() {
    if (this.type !== null) {
      return this.camelCaseToSpaces(BuildingType[this.buildingType]);
    }

    return "";
  }
}

export enum SiteObjectType {
  Building = 0,
  Grounds,
  Infrastructure
}

export enum BuildingType {
  None,
  Rental,
  Accommodation,
  Office,
  Warehouse,
  Education,
  Other
}



