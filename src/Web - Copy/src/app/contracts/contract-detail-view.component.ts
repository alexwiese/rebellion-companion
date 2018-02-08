import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { ContractDetail } from "app/models/contracts/contract";
import { ContractService } from "../services/contract.service";
import { AuthService } from "../services/auth.service";
import { BaseComponent } from "../shared/base.component";
import * as _ from "underscore";


@Component({
    selector: "aed-contract-detail-view",
    templateUrl: "contract-detail-view.component.html",
    styles: []
})

export class ContractDetailViewComponent extends BaseComponent implements OnInit {
    contract: ContractDetail;

    constructor(
        private authService: AuthService,
        private contractService: ContractService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.contractService.getContract(id).finally(() => {
            this.loading = false;
        }).subscribe((contract) => {
            this.contract = contract;
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Contract Error", detail: error });
        });
    }

    edit(): void {
        if (this.contract) {
            this.router.navigate(["contract", this.contract.id]);
        }
    }
}
