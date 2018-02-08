import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { ContractSummary } from "../models/contracts/contract";
import { ContractService } from "../services/contract.service";
import { DataTable, SharedModule, Button } from "primeng/primeng";
import { PagerComponent } from "../shared/pager.component";

@Component({
    selector: "aed-contract-summary-list",
    templateUrl: "./contract-summary-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class ContractSummaryListComponent extends PagerComponent<ContractSummary> implements OnInit {
    @Input() businessId = "";

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private contractService: ContractService,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        this.contractService.getContracts().subscribe(
            (contracts: ContractSummary[]) => {
                this.setItems(contracts);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Contracts Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
            }
        );
    }
}
