import { BaseModel } from "app/models/base-model";
import { SelectItem } from "primeng/primeng";

export class PersonDetail extends BaseModel {

    public fullName = "";
    public roles: SelectItem[] = [];
    public businesses: any[] = [];

    constructor(
        public id = "",
        public createdDate = new Date(),
        public firstName = "",
        public lastName = "",
        public userName = "",
        public active = false,
        public email = "",
        public phoneNumber = "",
        public password = "",
        public businessId = "",
        public businessName = "",
        public role: RoleType = RoleType.FieldWorker,
        public roleString = "",
        public isPlanner = false,
        public isScheduler = false,
        public isAssetAuditor = false,
        public isTechnician = false,
        public imageDisplayUri = "") {
        super();

        this.roles = super.getSelectItemsFromEnum(RoleType);

        if (this.firstName && this.lastName) {
            this.fullName = this.firstName + " " + this.lastName;
        }
    }
}

export class PersonSummary {

    public fullName = "";

    constructor(
        public id = "",
        public createdDate = new Date(),
        public firstName = "",
        public lastName = "",
        public userName = "",
        public email = "",
        public businessId = "",
        public businessName = "",
        public phoneNumber = "",
        public active = false,
        public role: RoleType = RoleType.FieldWorker,
        public roleString = "",
        public supervisorPermissions = "",
        public fieldWorkerPermissions = "",
        public isInducted = false,
        public imageDisplayUri = ""
    ) {
        if (this.firstName && this.lastName) {
            this.fullName = this.firstName + " " + this.lastName;
        }

        if (this.supervisorPermissions === "0") {
            this.supervisorPermissions = "";
        }

        if (this.fieldWorkerPermissions === "0") {
            this.fieldWorkerPermissions = "";
        }
    }
}

export enum RoleType {
    SystemAdministrator = 0,
    OwnerAdministrator,
    OwnerManager,
    Maintainer,
    Supervisor,
    FieldWorker
}
