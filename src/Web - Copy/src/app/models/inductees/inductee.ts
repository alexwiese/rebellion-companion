import { BaseModel } from "app/models/base-model";

export class BusinessInducteeDetail extends BaseModel {
    constructor(
        public id = "",
        public createdDate = new Date(),
        public active = true,
        public businessId = "",
        public businessName = "",
        public personId = "",
        public personName = "",
        public expiryDate = new Date(),
        public inductedDate = new Date(),
        public absoluteUri: ""
      ) {
        super();
      }
}
