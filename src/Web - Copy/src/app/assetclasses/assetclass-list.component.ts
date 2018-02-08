import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { BaseComponent } from "app/shared/base.component";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AssetService } from "app/services/asset.service";
import { AssetClass, AssetType } from "app/models/assets/asset"
import { TreeTableModule, TreeNode, SharedModule, Message, Messages, DialogModule } from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-assetclass-list",
    templateUrl: "assetclass-list.component.html",
    styles: [`.assetTypeNameButton span {
        max-width: 150px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }`]
})

export class AssetClassListComponent extends BaseComponent implements OnInit {

    msgs: Message[];
    assetClasses: TreeNode[] = [];
    assetClass: AssetClass;
    selectedAssetClass: TreeNode;
    assetClassForm: FormGroup;
    showAddAssetClassDialog = false;
    dialogHeader = "";
    dialogWidth = 600;
    levelLabel = "";
    submitted = false;
    persistenceMode = "add";
    showAssetTypeDialog = false;

    constructor(private assetService: AssetService,
        protected location: Location,
        private fb: FormBuilder) {
        super(location);
    }

    ngOnInit(): void {
        this.loadAssetClasses();
    }

    loadAssetClasses(): void {
        this.assetService.getAssetClasses().finally(() => {
          this.loading = false;
          this.loaded = true;
        }).subscribe((assetClasses) => {
            this.assetClasses = <TreeNode[]>assetClasses;

            if (this.assetClasses.length > 0) {
                this.assetClass = assetClasses[0];
            }
        },
            (error) => {
                this.errors.push({ severity: "error", summary: "Asset Classes Error", detail: error });
            }, () => {
                this.loading = false;
                this.loaded = true;
            })
    }

    addNewAssetClass() {
        this.persistenceMode = "add"
        this.dialogHeader = "Add New Asset Class";
        this.showAddAssetClassDialog = true;
        this.levelLabel = "Level 1 Class";
        this.assetClass = new AssetClass(this.assetService.getEmptyGuid(), new Date(), "", "", "", 1, "", "", true, "");

        this.buildForm();
    }

    addAssetClassLevelOne() {
      this.errors = [];
      this.persistenceMode = "add"
      this.dialogHeader = "Add Asset Class (Level 1)";
      this.showAddAssetClassDialog = true;
      const level =  1;
      this.assetClass = new AssetClass(this.assetService.getEmptyGuid(), new Date(), "", "", "",
          level, "", "", true);
      this.levelLabel = `Level ${level} Class`;

      this.buildForm();
    }

    addAssetClass(assetClass: AssetClass) {
      this.errors = [];
        this.persistenceMode = "add"
        this.dialogHeader = "Add Asset Class";
        this.showAddAssetClassDialog = true;
        const level = assetClass.level + 1;
        this.assetClass = new AssetClass(this.assetService.getEmptyGuid(), new Date(), "", "", "",
            level, "", "", true, assetClass.id);
        this.levelLabel = `Level ${level} Class`;

        this.buildForm();
    }

    editAssetClass(assetClass: AssetClass) {
      this.errors = [];
        this.persistenceMode = "edit";
        this.dialogHeader = "Edit Asset Class";
        this.showAddAssetClassDialog = true;
        this.levelLabel = `Level ${assetClass.level} Class`;
        this.assetClass = assetClass;

        this.buildForm();
    }

    nodeSelect(event) {
        this.assetClass = event.node.data;
    }

    buildForm(): void {
        if (this.assetClass) {
            this.assetClassForm = this.fb.group({
                "id": [this.assetClass.id || ""],
                "name": [this.assetClass.name || "", [Validators.required, Validators.maxLength(100)]],
                "description": [this.assetClass.description, Validators.maxLength(1000)],
                "level": [this.assetClass.level || 1, Validators.required],
                "assetTypeId": [this.assetClass.assetTypeId || ""],
                "assetTypeName": [this.assetClass.assetTypeName || ""],
                "canDelete": [this.assetClass.canDelete || true],
                "parentAssetClassId": [this.assetClass.parentAssetClassId || ""]
            });

        }
    }

    canAddAssetClass(node: any): boolean {
        return (node.level === 1 || node.level === 2 || node.level === 3) && this.assetClass.id === node.id;
    }

    canEditAssetClass(node: any): boolean {
        return this.assetClass.id === node.id;
    }

    canEditAssetType(node: any): boolean {
        return this.assetClass.id === node.id;
    }

    canDeleteAssetClass(node: any): boolean {
        return node.canDelete && this.assetClass.id === node.id;
    }

    onSubmit(value: any): void {
        alert("asset class list subitted(): " + JSON.stringify(value));
        this.submitted = true;
        if (this.assetClassForm.valid) {
            this.loading = true;

            // Edit only
            this.assetClass.name = value.name;
            this.assetClass.description = value.description;

            // Creating new
            if (this.persistenceMode === "add") {
                this.assetClass.assetTypeId = value.assetTypeId;
                this.assetClass.canDelete = value.canDelete || true;
                this.assetClass.createdDate = value.createdDate || new Date;
                this.assetClass.level = value.level;
                this.assetClass.id = value.id;
                this.assetClass.parentAssetClassId = value.parentAssetClassId;
            }

            this.assetService.saveAssetClass(this.assetClass).finally(() => {
              this.loading = false;
              this.showAddAssetClassDialog = false;
            }).subscribe(
                item => this.loadAssetClasses(),
                error => this.errors.push({ severity: "error", summary: "Save Class Asset Error", detail: error })
            );
        }
    }

    deleteAssetClass(id: string) {
        this.loading = true;
        this.assetService.deleteAssetClass(id).subscribe(
            (item) => {
                if (item) {
                    this.loadAssetClasses();
                }
            },
            error => this.errors.push({ severity: "error", summary: "Delete Class Asset Error", detail: error }),
            this.loading = false
        );
    }

    addAssetType(assetClass: AssetClass) {
        this.showAssetTypeDialog = true;
    }

    editAssetType(assetClass: AssetClass) {
        this.showAssetTypeDialog = true;
    }

    assetTypeCancelled(assetType: AssetType) {
        this.showAssetTypeDialog = false;
    }

    assetTypeSaved(assetType: AssetType) {
        this.showAssetTypeDialog = false;
        this.loadAssetClasses();
    }
}
