export class BusinessSummary {
    constructor(
        public id = "",
        public identity = "",
        public createdDate = new Date(),
        public name = "",
        public assetOwner = false,
        public assetMaintainer = false,
        public active = false,
        public personCount = 0,
        public siteCount = 0) {}
}




