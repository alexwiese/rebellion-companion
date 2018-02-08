import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PersonService } from "app/services/person.service";
import { AuthService } from "../services/auth.service";
import { Message, Panel, Messages, Button } from "primeng/primeng";
import { PersonSummary } from "../models/people/person";

@Component({
    selector: "aed-person-summary-view",
    templateUrl: "./person-summary-view.component.html",
    styles: []
})
export class PersonSummaryViewComponent implements OnInit {

    person: PersonSummary;
    errors: Message[] = [];
    loading = false;
    activateButtonText = "";

    constructor(
        private authService: AuthService,
        private personService: PersonService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;

        const id = this.activatedRoute.snapshot.params["id"];

        this.personService.getSummary(id).subscribe(
            (person) => {
                this.person = person;
            },
            error => this.errors.push({ severity: "error", summary: "Person Error", detail: error }),
            this.loading = false
        );
    }

    activatePerson(person: PersonSummary): void {
        this.loading = true;
        this.errors = [];

        this.personService.activate(person.id).subscribe(
            active => this.person.active = active,
            error => this.errors.push({ severity: "error", summary: "Person Error", detail: error }),
            this.loading = false
        );
    }

    editPerson(): void {
        this.router.navigate(["person/edit", this.person.id]);
    }

    activateLabel(person: PersonSummary): string {
        if (person.active) {
            return "Deactivate";
        }

        return "Activate";
    }
}
