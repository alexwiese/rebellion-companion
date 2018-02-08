import { Component, Input, OnInit } from "@angular/core";
import { PagerComponent } from "../shared/pager.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { WorkInstructionSummary } from "../models/workinstructions/workinstruction-summary";
import { WorkInstructionService } from "../services/workinstruction.service";
import * as _ from "underscore";

@Component({
    selector: "aed-workinstructions-list",
    templateUrl: "./workinstruction-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class WorkInstructionListComponent extends PagerComponent<WorkInstructionSummary> implements OnInit {

    constructor(private workInstructionService: WorkInstructionService, private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.searchItems();
    }

    searchItems() {
        this.loading = true;
        this.workInstructionService.getWorkInstructions().subscribe(
            (items: WorkInstructionSummary[]) => {
                this.setItems(items);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Work Instructions Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
                this.loaded = true;
            }
        );
    }

    onSelect(item: WorkInstructionSummary) {
        this.selectedItem = item;
    }
}
