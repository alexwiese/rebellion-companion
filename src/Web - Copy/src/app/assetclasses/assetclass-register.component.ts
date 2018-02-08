import { Component, OnInit, AfterContentInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AssetService } from "app/services/asset.service";
import { AuthService } from "app/services/auth.service";
import { BaseComponent } from "app/shared/base.component";
import { ModelSummary } from "app/models/models/model-summary";
import { Asset } from "app/models/assets/asset";
import {
    Panel,
    InputText,
    Button,
    Message,
    FileUploadModule,
    DataTableModule
} from "primeng/primeng";
import * as _ from "underscore";

@Component({
    selector: "aed-assetclass-register",
    templateUrl: "assetclass-register.component.html",
    styles: [`body .ui-messages.ui-messages-success { background-color: green; }`]
})

export class AssetClassRegisterComponent extends BaseComponent implements OnInit {
    assetClasses: any[] = [];
    errorMessages: any[] = [];
    uploadFilesUrl = "";
    uploadingFile = false;
    uploadResultErrors: Message[] = [];
    uploadResultExists: Message[] = [];
    uploadResultSuccesses: Message[] = [];

    constructor(private assetService: AssetService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        protected location: Location,
        private router: Router) {
        super(location);
    }

    saveAssetClasses() {
        this.errorMessages = [];
        this.uploadResultErrors = [];
        this.uploadResultSuccesses = [];
        this.uploadResultExists = [];
        this.uploadingFile = true;

        this.assetService.saveAssetClassUploads(this.assetClasses).finally(() => {
            this.assetClasses = [];
            this.uploadingFile = false;
        }).subscribe(result => {
            this.uploadingFile = true;

            const successfulUploads = this.assetClasses.length - result.errors.length;
            const failedUploads = result.errors.length;
            const successCount = result.successCount;
            const existsCount = result.existsCount;

            if (existsCount > 0) {
                this.uploadResultExists.push({
                    severity: "warn", summary: existsCount + " Asset Classes Already Exist",
                    detail: `There were ${existsCount} asset classes that already exist so were not inserted`
                });
            }

            if (failedUploads > 0) {
                this.uploadResultErrors.push({
                    severity: "warn", summary: failedUploads + " Asset Classes Not Imported",
                    detail: "These asset classes had validation errors and were not imported"
                });

                result.errors.forEach((e) => {
                    this.errorMessages.push({ text: e })
                });
            }

            if (successCount > 0) {
                this.uploadResultSuccesses.push({
                    severity: "success", summary: successCount + " Asset Classes Successfully Imported",
                    detail: `There were ${successCount} asset classes that were successfully inserted`
                });
            }
        }, (error) => {
            this.errors.push({ severity: "error", summary: "Save Asset Class Register Error", detail: error })
        })
    }

    ngOnInit(): void {
        this.uploadFilesUrl = this.assetService.assetClassRegisterFileUploadUrl();
    }

    onError(event) {
        this.uploadingFile = false;
        const message = JSON.parse(event.xhr.responseText).Message;
        this.errors.push({ severity: "error", summary: "Asset Class Files Error", detail: message });
        this.scrollToTop();
    }

    onBeforeUpload(event) {
        this.uploadingFile = true;
    }

    onBeforeSend(event) {
        event.xhr.open("post", this.uploadFilesUrl, true);
        event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService. getAuth().access_token}`);
    }

    onUpload(event) {
        this.assetClasses = (<any>JSON.parse(event.xhr.response).map(item => {
            return item;
        }));

        this.uploadingFile = false;
        this.scrollToTop();
    }

    assetsUploading(): boolean {
        return this.uploadingFile === true;
    }
}
