import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Http, Response } from "@angular/http";
import { SiteObjectDetail } from "app/models/siteobjects/siteobject-detail";
import { SiteDetail } from "app/models/sites/site-detail";
import { SiteService } from "app/services/site.service";
import { SiteObjectService } from "app/services/siteobject.service";
import { AuthService } from "app/services/auth.service";
import { ValidatorService } from "app/services/validator.service";
import { BaseComponent } from "../shared/base.component";
import { environment } from "environments/environment";
import * as _ from "underscore";

@Component({
  selector: "aed-siteobject-detail-view",
  templateUrl: "./siteobject-detail-view.component.html",
  styles: []
})
export class SiteObjectDetailViewComponent extends BaseComponent implements OnInit {

  siteObject: SiteObjectDetail;

  constructor(
    private siteobjectService: SiteObjectService,
    private activatedRoute: ActivatedRoute,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;

    const id = this.activatedRoute.snapshot.params["id"];

    this.siteobjectService.getSiteObject(id).subscribe((siteObject) => {
      this.siteObject = siteObject;
    },
      (error) => {
        this.errors.push({ severity: "error", summary: "SiteObject Error", detail: error });
      },
      () => {
        this.loading = false;
      });
  }
}
