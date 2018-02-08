import { KeyValue } from "app/models/key-value";
import { RegionType, CountryType } from "app/models/address/address";
import { SelectItem } from "primeng/primeng";
import * as _ from "underscore";

export class ObjectStateModel {
  public objectState: ObjectState;

  constructor(os: ObjectState) {
    this.objectState = os;
  }
}

export enum ObjectState {
  Unchanged = 0,
  Added,
  Modified,
  Deleted
}

export class BaseModel {
  getSelectItemsFromEnum(
    enumType: any,
    camelCaseToSpaces = true,
    includeEmptyRow = false,
    excludedProperties: string[] = []
  ): SelectItem[] {
    let selectItems: SelectItem[] = [];
    let index = 0;
    if (includeEmptyRow) {
      selectItems.push({ label: null, value: null });
    }
    for (const n in enumType) {
      if (typeof enumType[n] === "number") {
        let v = n;
        if (camelCaseToSpaces) {
          v = this.camelCaseToSpaces(n);
        }
        if (!_.contains(excludedProperties, v)) {
          selectItems.push({ label: v, value: index++ });
        }
      }
    }

    selectItems = _.sortBy(selectItems, function(o) {
      if (o.label) {
        return o.label.toUpperCase();
      }
      return "";
    });

    return selectItems;
  }

  camelCaseToSpaces(text: string) {
    return text.replace(/([A-Z])/g, " $1").trim();
  }

  getValueFromPairs(list: [any], id: number) {
    const result = <any>_.findWhere(list, { key: id });

    if (result) {
      return <any>result.value;
    }

    return "";
  }
}

export class AddressModel extends BaseModel {
  public regions: SelectItem[] = [];
  public countries: SelectItem[] = [];

  constructor(
    public addressId = "",
    public addressStreet = "",
    public addressSuburb = "",
    public addressPostCode = "",
    public addressRegion = RegionType.ACT,
    public addressCountry = CountryType.Australia
  ) {
    super();

    this.countries = super.getSelectItemsFromEnum(CountryType);
    this.regions = super.getSelectItemsFromEnum(RegionType, false);
  }

  regionString(): string {
    return RegionType[this.addressRegion];
  }

  countryString(): string {
    return CountryType[this.addressCountry];
  }

  addressString(): string {
    return (
      this.addressStreet +
      ", " +
      this.addressSuburb +
      ", " +
      this.addressPostCode +
      ", " +
      this.regionString() +
      ", " +
      this.countryString()
    );
  }
}
