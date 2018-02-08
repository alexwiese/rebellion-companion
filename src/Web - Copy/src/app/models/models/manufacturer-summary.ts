import { ModelSummary } from "app/models/models/model-summary";

export class ManufacturerSummary {
    public models: ModelSummary[] = [];

    constructor(
        public id = "",
        public createdDate = new Date(),
        public name = "",
        public canDelete = false,
        public active = false,
        public modelCount = 0) { }
}

export class ManufacturerDetail {
    public models: ModelSummary[] = [];

    constructor(
        public id = "",
        public createdDate = new Date(),
        public name = "",
        public canDelete = false,
        public active = false) { }
}



