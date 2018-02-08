import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { ComplianceItemDetail } from "app/models/compliance/compliance-detail";
import { ComplianceItemService } from "app/services/compliance.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";
import {
  Panel,
  InputText,
  Button,
  Message,
  Dropdown
} from "primeng/primeng";

import * as _ from "underscore";

@Component({
  selector: "aed-compliance-item-detail",
  templateUrl: "./compliance-item-detail.component.html",
  styles: [`.mr-10 { margin-right: 10px; }`]
})
export class ComplianceItemDetailComponent extends BaseComponent implements OnInit {
  complianceItemId: string;
  complianceForm: FormGroup;
  complianceItem: ComplianceItemDetail = null;

  constructor(
    private http: Http,
    private authService: AuthService,
    private complianceItemService: ComplianceItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    this.complianceItemId = this.activatedRoute.snapshot.params["id"];

    if (this.complianceItemId) {
      this.complianceItemService.getComplianceItem(this.complianceItemId).finally(() => {
        this.loading = false;
        this.loaded = true;
      }).subscribe((item) => {
        this.complianceItem = item;
        this.buildForm();
      },
        (error) => {
          this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error });
        }
        );
    } else {
      this.complianceItem = new ComplianceItemDetail("", new Date(), "", true, "", 0, 0);
      this.buildForm();
      this.loading = false;
      this.loaded = true;
    }
  }

  buildForm(): void {
    if (this.complianceItem) {
      this.complianceForm = this.fb.group({
        "id": [this.complianceItem.id || ""],
        "active": [this.complianceItem.active || true],
        "name": [this.complianceItem.name || "", [Validators.required, Validators.maxLength(100)]],
        "issuingAuthority": [this.complianceItem.issuingAuthority, [Validators.required, Validators.maxLength(100)]],
        "type": [this.complianceItem.type, Validators.required],
        "level": [this.complianceItem.level, Validators.required]
      });
    }
  }

  onSubmit(value: any): void {
    this.complianceItemService.saveComplianceItem(value).subscribe(
      item => this.location.back(),
      error => this.errors.push({ severity: "error", summary: "Compliance Item Error", detail: error }),
      this.loading = false
    );
  }
}
