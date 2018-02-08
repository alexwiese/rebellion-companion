import { Component, OnInit, AfterContentInit, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import "rxjs/add/operator/mergeMap";
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
    selector: "aed-asset-register",
    templateUrl: "asset-register.component.html",
    styles: [`body .ui-messages.ui-messages-success { background-color: green; }`]
})

export class AssetRegisterComponent extends BaseComponent implements OnInit {
    assets: any[] = [];
    errorMessages: any[] = [];
    uploadFilesUrl = "";
    uploadingFile = false;
    uploadResultErrors: Message[] = [];
    uploadResultSuccesses: Message[] = [];
    fileUploaded = false;

    constructor(private assetService: AssetService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        protected location: Location,
        private router: Router) {
        super(location);
    }

    saveAssetUploads() {
        this.errorMessages = [];
        this.fileUploaded = false;

        this.assetService.saveAssetUploads(this.assets).subscribe(errors => {
            errors.forEach((e) => {
                this.errorMessages.push({ text: e })
            })

            const assetsWithoutErrors = _.filter(this.assets, (a) => {
                return a.errorMessages.length === 0;
            })

            const successfulUploads = assetsWithoutErrors.length - errors.length;
            const failedUploads = errors.length;

            this.uploadResultErrors.push({
                severity: "warn", summary: failedUploads + " Assets Not Imported",
                detail: "These assets had validation errors and were not imported"
            });

            this.uploadResultSuccesses.push({
                severity: "success", summary: successfulUploads + " Assets Successfully Imported",
                detail: ""
            });
        })
    }

    ngOnInit(): void {
        this.uploadFilesUrl = this.assetService.assetRegisterFileUploadUrl();
    }

    onError(event) {
        this.fileUploaded = false;
        this.uploadingFile = false;
        const message = JSON.parse(event.xhr.responseText).Message;
        this.errors.push({ severity: "error", summary: "Asset Files Error", detail: message });
        this.scrollToTop();
    }

    onBeforeUpload(event) {
        this.uploadingFile = true;
        this.errorMessages = [];
        this.uploadResultErrors = [];
        this.uploadResultSuccesses = [];
    }

    onBeforeSend(event) {
        event.xhr.open("post", this.uploadFilesUrl, true);
        event.xhr.setRequestHeader("Authorization", `Bearer ${this.authService. getAuth().access_token}`);
    }

    onUpload(event) {
        this.assets = (<any>JSON.parse(event.xhr.response).map(item => {
            return item;
        }));

        _.flatten(_.pluck(this.assets, "errorMessages")).forEach((e) => {
            this.errorMessages.push({ text: e })
        })

        this.uploadingFile = false;
        this.fileUploaded = true;
    }
}
