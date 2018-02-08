import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { LegacyIdentity } from "../models/assets/asset";
import { PagerComponent } from "../shared/pager.component";
import { DataTable, SharedModule, Button, Message } from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-legacyidentity-list",
    templateUrl: "./legacyidentity-list.component.html",
    styles: [`.label { cursor: pointer; padding: 5px; }`]
})

export class LegacyIdentityListComponent extends PagerComponent<LegacyIdentity> implements OnInit, OnChanges {
    @Input() legacyIdentities: LegacyIdentity[] = [];

    @Output() onAddNewLegacyIdentity: EventEmitter<boolean>
        = new EventEmitter<boolean>();

    @Output() onEditLegacyIdentity: EventEmitter<LegacyIdentity>
        = new EventEmitter<LegacyIdentity>();

    @Output() onDeleteLegacyIdentity: EventEmitter<LegacyIdentity>
        = new EventEmitter<LegacyIdentity>();

    constructor(private router: Router,
        protected location: Location) {
        super(location);
    }

    ngOnInit() {
        this.items = this.legacyIdentities;
        this.loading = false;
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        this.items = changes.legacyIdentities.currentValue;
    }

    addLegacyIdentity() {
        this.onAddNewLegacyIdentity.emit(true);
    }

    editLegacyIdentity(item: LegacyIdentity) {
        this.onEditLegacyIdentity.emit(item);
    }

     deleteLegacyIdentity(item: LegacyIdentity) {
        this.onDeleteLegacyIdentity.emit(item);
    }
}
