import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { SelectItem } from "primeng/primeng";
import { PersonSummary, RoleType } from "app/models/people/person";

export class ContractDetail extends BaseModel {
  public roles: SelectItem[] = [];
  public files: ContractFile[] = [];
  public contractRoleString = "";

  constructor(
    public id = "",
    public createdDate: Date = new Date(),
    public active = true,
    public name = "",
    public contactName = "",
    public contactPhone = "",
    public contactEmail = "",
    public contactBusinessId = "",
    public contactBusinessName = "",
    public contractorName = "",
    public contractorPhone = "",
    public contractorEmail = "",
    public contractorBusinessId = "",
    public contractorBusinessName = "",
    public contractorRole = RoleType.OwnerAdministrator,
    public tenderSubmissionDate: Date = new Date(),
    public contractorAwardDate: Date = new Date(),
    public startDate: Date = new Date(),
    public endDate: Date = new Date()
  ) {
    super();

    this.roles = super.getSelectItemsFromEnum(RoleType);
    this.contractRoleString = this.camelCaseToSpaces(
      RoleType[this.contractorRole]
    );
  }

  roleString(): string {
    return this.camelCaseToSpaces(RoleType[this.contractorRole]);
  }
}

export class ContractSummary extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public active = true,
    public name = "",
    public contactBusinessName = "",
    public contractorBusinessName = "",
    public contractorRole = RoleType.OwnerAdministrator,
    public startDate = new Date(),
    public endDate = new Date(),
    public canEdit = true
  ) {
    super();
  }
}

export class ContractFile extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public fileName = "",
    public originalFileName = "",
    public fileType = "",
    public contractId = "",
    public displayUri = ""
  ) {
    super();
  }
}
