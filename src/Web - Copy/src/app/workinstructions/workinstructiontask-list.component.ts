import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { PagerComponent } from "../shared/pager.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { WorkInstructionType } from "../models/workinstructions/workinstruction-detail";
import {
  WorkInstructionTask,
  WorkInstructionTaskServiceFrequency
} from "../models/workinstructions/workinstructiontask";
import { WorkInstructionService } from "../services/workinstruction.service";
import { ValidatorService } from "app/services/validator.service";
import { SelectItem } from "primeng/primeng";
import "rxjs/add/operator/mergeMap";
import * as _ from "underscore";

@Component({
  selector: "aed-workinstructiontasks-list",
  templateUrl: "./workinstructiontask-list.component.html",
  styles: [`.label { cursor: pointer; padding: 5px; }`]
})
export class WorkInstructionTaskListComponent extends PagerComponent<
  WorkInstructionTask
> implements OnInit {
  @Input() workInstructionId: string;
  @Output()
  onWorkInstructionTaskCreated: EventEmitter<
    WorkInstructionTask
  > = new EventEmitter<WorkInstructionTask>();

  displayDialog = false;
  newWorkInstructionTask = false;
  workInstructionTask: WorkInstructionTask;
  workInstructionTaskForm: FormGroup;
  serviceValueNames: SelectItem[] = [];
  serviceValueUoms: SelectItem[] = [];
  selectedFrequencyNames: string[] = [];
  frequencies: WorkInstructionTaskServiceFrequency[] = [];
  frequencyNames: string[] = [];
  submitted = false;

  constructor(
    private workInstructionService: WorkInstructionService,
    private router: Router,
    protected location: Location,
    private fb: FormBuilder
  ) {
    super(location);
  }

  ngOnInit() {
    this.searchItems();
  }

  searchItems() {
    this.loading = true;

    this.getServiceValueNames();
    this.getServiceValueUoMs();

    this.workInstructionService
      .getWorkInstructionTasks(this.workInstructionId)
      .flatMap((items: WorkInstructionTask[]) => {
        this.setItems(items);
        return this.workInstructionService.getWorkInstructionServiceFreqencies();
      })
      .subscribe(
        frequencies => {
          this.frequencies = frequencies;

          if (this.frequencyNames.length === 0) {
            this.frequencies.forEach(f => {
              this.frequencyNames.push(f.name);
            });
          }
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Work Instruction Error",
            detail: error
          });
        },
        () => {
          this.loaded = true;
          this.loading = false;
        }
      );
  }

  onSelect(item: WorkInstructionTask) {
    this.selectedItem = item;
  }

  onActivate(item: WorkInstructionTask): void {
    this.loading = true;
    this.errors = [];

    this.workInstructionService.activateWorkInstructionTask(item.id).subscribe(
      active => (item.active = active),
      error =>
        this.errors.push({
          severity: "error",
          summary: "Work Instruction Tasks Error",
          detail: error
        }),
      (this.loading = false)
    );
  }

  onEditWorkInstructionTask(item: WorkInstructionTask) {
    this.newWorkInstructionTask = false;
    this.workInstructionTask = item;
    this.workInstructionTask.serviceFrequencies.forEach(f => {
      this.selectedFrequencyNames.push(f.name);
    });
    this.buildForm();
    this.onServiceValueRequiredChanged();
    this.displayDialog = true;
  }

  onRowSelect(event) {
    this.onEditWorkInstructionTask(event.data);
  }

  private getServiceValueNames() {
    this.workInstructionService
      .getWorkInstructionTaskServiceNameValues()
      .forEach(i => {
        this.serviceValueNames.push({ label: i, value: i });
      });
    this.setDefaultObject(this.serviceValueNames);
  }

  private getServiceValueUoMs() {
    this.workInstructionService
      .getWorkInstructionTaskServiceUOMs()
      .forEach(i => {
        this.serviceValueUoms.push({ label: i, value: i });
      });
    this.setDefaultObject(this.serviceValueUoms);
  }

  private onServiceValueRequiredChanged() {
    if (this.workInstructionTaskForm) {
      this.workInstructionTaskForm
        .get("isServiceValueRequired")
        .valueChanges.subscribe((required: boolean) => {
          const serviceValueNameControl = this.workInstructionTaskForm.get(
            "serviceValueName"
          );
          const serviceUoMControl = this.workInstructionTaskForm.get(
            "serviceValueUnitOfMeasure"
          );

          if (required) {
            serviceValueNameControl.setValidators(
              ValidatorService.workInstructionTaskServiceValueRequired
            );
            serviceUoMControl.setValidators(
              ValidatorService.workInstructionTaskServiceValueRequired
            );
          } else {
            serviceValueNameControl.clearValidators();
            serviceUoMControl.clearValidators();
          }

          serviceValueNameControl.updateValueAndValidity();
          serviceUoMControl.updateValueAndValidity();
        });
    }
  }

  buildForm(): void {
    if (this.workInstructionTask) {
      this.workInstructionTaskForm = this.fb.group({
        id: [this.workInstructionTask.id || ""],
        active: [this.workInstructionTask.active || true],
        isMandatory: [this.workInstructionTask.isMandatory || true],
        taskNumber: [this.workInstructionTask.taskNumber, Validators.required],
        description: [
          this.workInstructionTask.description,
          Validators.maxLength(1000)
        ],
        type: [this.workInstructionTask.type, Validators.required],
        selectedFrequencyNames: [this.selectedFrequencyNames],
        serviceValueName: [
          this.workInstructionTask.serviceValueName || "",
          ValidatorService.workInstructionTaskServiceValueRequired
        ],
        serviceValueUnitOfMeasure: [
          this.workInstructionTask.serviceValueUnitOfMeasure,
          ValidatorService.workInstructionTaskServiceValueRequired
        ],
        isServiceValueRequired: [
          this.workInstructionTask.isServiceValueRequired || false
        ]
      });
    }

    this.onServiceValueRequiredChanged();
  }

  oc(event: boolean, frequencyName: any) {
    if (event) {
      const frequency = _.findWhere(this.frequencies, { name: frequencyName });

      if (frequency) {
        this.workInstructionTask.serviceFrequencies.push(frequency);
      }
    } else {
      this.workInstructionTask.serviceFrequencies = _.without(
        this.workInstructionTask.serviceFrequencies,
        _.findWhere(this.workInstructionTask.serviceFrequencies, {
          name: frequencyName
        })
      );
    }
  }

  canViewServiceDetails(): boolean {
    return (
      this.workInstructionTask.workInstructionType ===
      WorkInstructionType.MaintenancePlan
    );
  }

  findSelectedTaskIndex(task: WorkInstructionTask): number {
    return _.findIndex(this.items, function(item) {
      return item.id === task.id;
    });
  }

  onCreateNewTask() {
    this.newWorkInstructionTask = true;
    this.workInstructionTask = new WorkInstructionTask(
      this.getEmptyGuid(),
      this.workInstructionId
    );
    this.workInstructionTask.serviceFrequencies.forEach(f => {
      this.selectedFrequencyNames.push(f.name);
    });
    this.buildForm();
    this.onServiceValueRequiredChanged();
    this.displayDialog = true;
  }

  showSaveTextOnButton(): boolean {
   return !this.isEmptyGuid(this.workInstructionTask.id);
  }

  onSubmit(value: any): void {
    this.submitted = true;

    if (this.workInstructionTaskForm.valid) {
      value.serviceFrequencies = this.workInstructionTask.serviceFrequencies;
      value.workInstructionId = this.workInstructionId;
      value.workInstructionType = this.workInstructionTask.workInstructionType;

      const isNewTask = this.isEmptyGuid(value.id);

      if (!this.workInstructionId || this.isEmptyGuid(this.workInstructionId)) {
        this.items = [...this.items, value];
        this.displayDialog = false;
        this.loading = false;
        this.onWorkInstructionTaskCreated.emit(value);
        return;
      }

      this.workInstructionService.saveWorkInstructionTask(value).subscribe(
        item => {
          if (isNewTask) {
            this.items = [...this.items, item];
          } else {
            this.items[this.findSelectedTaskIndex(item)] = item;
            this.items = [...this.items];
          }
        },
        error =>
          this.errors.push({
            severity: "error",
            summary: "Work Instruction Task Error",
            detail: error
          }),
        () => {
          this.displayDialog = false;
          this.loading = false;
        }
      );
    }
  }
}
