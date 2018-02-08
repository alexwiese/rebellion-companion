import { BaseModel } from "app/models/base-model";
import { WorkInstructionType } from "app/models/workinstructions/workinstruction-detail";
import { SelectItem } from "primeng/primeng";

export enum WorkInstructionAnswerType {
  YesNo = 0,
  PassFail,
}

export class WorkInstructionTask extends BaseModel {

  public types: SelectItem[] = [];
  public serviceFrequencies: WorkInstructionTaskServiceFrequency[] = [];

  constructor(
    public id = "",
    public workInstructionId = "",
    public workInstructionType = WorkInstructionType.MaintenancePlan,
    public createdDate = new Date(),
    public active = true,
    public taskNumber: number = 0.1,
    public isMandatory = false,
    public description = "",
    public serviceFrequenciesSummary = "",
    public serviceValueName = "",
    public serviceValueUnitOfMeasure = "",
    public type: WorkInstructionAnswerType = WorkInstructionAnswerType.YesNo,
    public isServiceValueRequired = false
  ) {
    super();

    this.types = super.getSelectItemsFromEnum(WorkInstructionAnswerType);
  }

  typeString(): string {
    return this.camelCaseToSpaces(WorkInstructionType[this.type]);
  }
}

export class WorkInstructionTaskServiceFrequency extends BaseModel {

  constructor(
    public serviceFrequencyId = "",
    public createdDate = new Date(),
    public active = true,
    public order: number = 1,
    public name = "",
    public shortName = "",
    public workInstructionTaskId = ""
  ) {
    super();
  }
}
