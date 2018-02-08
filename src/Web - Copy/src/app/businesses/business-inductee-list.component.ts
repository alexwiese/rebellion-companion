import { RoleType } from "../models/people/person";
import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BusinessInducteeDetail } from "app/models/inductees/inductee"
import { PagerComponent } from "../shared/pager.component";
import { BusinessService } from "../services/business.service";
import { InducteeService } from "../services/inductee.service";
import { AuthService } from "../services/auth.service";
import { BaseComponent } from "../shared/base.component";
import { DataTable, SharedModule, Button, Message } from "primeng/primeng";

import * as _ from "underscore";

@Component({
    selector: "aed-business-inductee-list",
    templateUrl: "./business-inductee-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class BusinessInducteeListComponent extends PagerComponent<BusinessInducteeDetail> implements OnInit {
    query: string;
    errors: Message[] = [];
    loading = false;
    loaded = false;
    items: BusinessInducteeDetail[];
    numberOfItems = 0;

    @Input() businessId = "";
    @Input() personId = "";
    @Input() showEditButton = true;

    constructor(private authService: AuthService,
        private router: Router,
        protected location: Location,
        private inducteeService: InducteeService) {
        super(location);
    }

    ngOnInit() {
        this.loading = true;

        this.inducteeService.getBusinessInductees(this.businessId, this.personId).subscribe((inductees) => {
            this.setItems(inductees);
        },
            (error) => {
                this.errors.push({ severity: "error", summary: "Business Inductee Error", detail: error });
                this.numberOfItems = 0;
            },
            () => {
                this.loading = false;
                this.loaded = false;
            });
    }
}
