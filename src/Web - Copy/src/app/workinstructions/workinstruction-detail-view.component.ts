import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkInstructionService } from "../services/workinstruction.service";
import { BaseComponent } from "../shared/base.component";
import { WorkInstructionDetail } from "../models/workinstructions/workinstruction-detail";
import {
  Panel,
  InputText,
  Button,
  Message,
  Messages,
  InputTextarea,
} from "primeng/primeng";

import * as moment from "moment";

@Component({
  selector: "aed-work-instruction-detail-view",
  templateUrl: "workinstruction-detail-view.component.html",
  styles: [`
    .work-instruction-container
    {
        border: gray 1px solid;
        padding: 10px;
        margin-bottom: 10px;
    }`]
})

export class WorkInstructionDetailViewComponent extends BaseComponent implements OnInit {
  workInstruction: WorkInstructionDetail;

  constructor(private workInstructionService: WorkInstructionService,
    private activatedRoute: ActivatedRoute,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    const id = this.activatedRoute.snapshot.params["id"];

    this.workInstructionService.getWorkInstruction(id).subscribe((workInstruction) => {
      this.workInstruction = workInstruction;
    },
      error => this.errors.push({ severity: "error", summary: "Work Instruction Error", detail: error }),
      () => {
        this.loading = false;
      }
    );
  }

  isDefault() {
    return this.workInstruction.isDefault ? "Yes" : "No";
  }

  assetTypesString(): string {
    let assetTypesString = "";
    this.workInstruction.assetTypes.forEach((i) => {
      if (assetTypesString.length > 0) {
        assetTypesString += ", " + i.name;
      } else {
        assetTypesString += i.name;
      }
    });
    return assetTypesString;
  }
}
