import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PersonSummary } from "app/models/people/person";
import { AuthService } from "app/services/auth.service";
import { PersonService } from "app/services/person.service";
import { DataTable, SharedModule, Button, Message, Tooltip } from "primeng/primeng";
import { PagerComponent } from "app/shared/pager.component";
import * as _ from "underscore";

@Component({
    selector: "aed-person-summary-list",
    templateUrl: "./person-summary-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})
export class PersonSummaryListComponent extends PagerComponent<PersonSummary> implements OnInit {
    @Input() businessId = "";
    @Input() showCancelButton = true;
    @Input() displayInducteeButton = false;

    constructor(private personService: PersonService,
        private authService: AuthService,
        private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.search();
    }

    onActivate(person: PersonSummary): void {
        this.loading = true;
        this.errors = [];

        this.personService.activate(person.id).subscribe(
            active => person.active = active,
            error => this.errors.push({ severity: "error", summary: "Person Error", detail: error }),
            this.loading = false
        );
    }

    search() {
        this.loading = true;

        if (this.businessId) {
            return this.getForBusiness(this.businessId);
        } else {
            return this.getAllPeople();
        }
    }

    getAllPeople() {
        this.personService.getAll().finally(() => {
            this.loading = false;
        }).subscribe(
            (persons: PersonSummary[]) => {
                this.setItems(persons);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Person Error", detail: error });
                this.numberOfItems = 0;
            });
    }

    getForBusiness(businessId: string) {
        this.personService.getForBusiness(this.businessId).finally(() => {
            this.loading = false;
        }).subscribe(
            (persons: PersonSummary[]) => {
                this.setItems(persons);
            },
            (error) => {
                this.errors.push({ severity: "error", summary: "Person Error", detail: error });
                this.numberOfItems = 0;
            });
    }

    activateLabel(person: PersonSummary): string {
        return person.active ? "Deactivate" : "Activate";
    }

    getInducteeButtonBackgroundColor(person: PersonSummary): string {
        return person.isInducted ? "green" : "";
    }

    inducteeButtonDisabled(person: PersonSummary): boolean {
        return person.isInducted ? true : false;
    }
}
