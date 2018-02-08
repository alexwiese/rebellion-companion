import { SiteType } from "app/models/sites/site-detail";
import { BaseModel } from "app/models/base-model";

export class SiteSummary extends BaseModel {
    public typeString = "";

    constructor(
        public id = "",
        public active = false,
        public createdDate = new Date(),
        public name = "",
        public code = "",
        public identity = "",
        public businessName = "",
        public businessId = "",
        public siteObjectCount = 0,
        public type: SiteType = SiteType.Agricultural
    ) {
        super();
        this.typeString = this.camelCaseToSpaces(SiteType[this.type]);
    }
}
