import { SiteObjectType } from "app/models/siteobjects/siteobject-detail";

import { BaseModel } from "app/models/base-model";

export class SiteObjectSummary extends BaseModel {

    public typeString = "";

    constructor(
        public id: string,
        public createdDate: Date,
        public name: string,
        public code: string,
        public identity = "",
        public type: SiteObjectType = SiteObjectType.Building,
        public legacyId: string,
        public active: boolean,
        public siteId: string,
        public siteName: string,
        public businessId: string,
        public businessName: string,
        public numberOfAssets: number,
        public numberOfJobs = 0) {
        super();
        this.typeString = this.camelCaseToSpaces(SiteObjectType[this.type]);
    }
}
