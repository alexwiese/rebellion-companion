import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";
import { BaseComponent } from "../shared/base.component";
import { SiteDetail } from "app/models/sites/site-detail";
import { SiteService } from "app/services/site.service";
import { Location } from "@angular/common";
import { environment } from "environments/environment";
import * as _ from "underscore";

@Component({
  selector: "aed-site-detail-view",
  templateUrl: "./site-detail-view.component.html",
  styles: []
})
export class SiteDetailViewComponent extends BaseComponent implements OnInit {

  site: SiteDetail;

  constructor(
    private siteService: SiteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected location: Location) {
    super(location);
  }

  ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.params["id"];

    this.siteService.getSite(id).subscribe(
      site => {
        this.site = site;
      },
      error =>  {
        this.errors.push({ severity: "error", summary: "Site Error", detail: error });
      },
      () => {
        this.loading = false;
      }
    );
  }

  complianceItemsString(): string {
    let complianceItemsString = "";
    this.site.complianceItems.forEach((i) => {
      if (complianceItemsString.length > 0) {
        complianceItemsString += ", " + i.name;
      } else {
        complianceItemsString += i.name;
      }
    });
    return complianceItemsString;
  }
}
