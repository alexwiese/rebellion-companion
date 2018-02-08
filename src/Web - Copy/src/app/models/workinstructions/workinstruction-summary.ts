import { BaseModel } from "app/models/base-model";
import { KeyValue } from "app/models/key-value";
import { AssetType } from "app/models/assets/asset";
import { WorkInstructionType } from "app/models/workinstructions/workinstruction-detail";

export class WorkInstructionSummary extends BaseModel {
  constructor(
    public id = "",
    public createdDate = new Date(),
    public active = true,
    public name = "",
    public code = "",
    public source = "",
    public description = "",
    public type: WorkInstructionType = WorkInstructionType.MaintenancePlan,
    public numberOfAssetTypes = 0
  ) {
    super();
  }

  typeString(): string {
    return this.camelCaseToSpaces(WorkInstructionType[this.type]);
  }
}
