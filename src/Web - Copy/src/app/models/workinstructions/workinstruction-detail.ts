import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { AssetType } from "app/models/assets/asset";
import { SelectItem } from "primeng/primeng";
import { WorkInstructionTask } from "app/models/workinstructions/workinstructiontask";
export class WorkInstructionDetail extends BaseModel {

  public types: SelectItem[] = [];

  constructor(
    public id = "",
    public isDefault = false,
    public createdDate = new Date(),
    public active = true,
    public name = "",
    public code = "",
    public source = "",
    public description = "",
    public type: WorkInstructionType = WorkInstructionType.MaintenancePlan,
    public assetTypes: AssetType[] = [],
    public tasks: WorkInstructionTask[] = []
  ) {
    super();

    this.types = super.getSelectItemsFromEnum(WorkInstructionType);
  }

  typeString(): string {
    return this.camelCaseToSpaces(WorkInstructionType[this.type]);
  }
}

export enum WorkInstructionType {
  General = 0,
  MaintenancePlan,
  RepairPlan,
  SafetyInstruction
}
