import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/mergeMap";
import { PersonDetail, PersonSummary } from "../models/people/person";
import { BusinessSummary } from "app/models/business/business-summary";
import { PersonService } from "app/services/person.service";
import { AuthService } from "../services/auth.service";
import { AuthHttp } from "app/services/auth.http";
import { BusinessService } from "../services/business.service";
import { ValidatorService } from "../services/validator.service";
import { SelectItem, Message } from "primeng/primeng";
import { BaseComponent } from "../shared/base.component";
import { environment } from "../../environments/environment";
import * as _ from "underscore";

export abstract class PersonDetailComponent extends BaseComponent {
  protected person: PersonDetail;
  protected personForm: FormGroup;
  protected submitted = false;
  protected selectedBusiness = "";
  protected businesses: SelectItem[] = [];

  constructor(
    protected http: Http,
    protected authHttp: AuthHttp,
    protected location: Location,
    protected authService: AuthService,
    protected personService: PersonService,
    protected businessService: BusinessService,
    protected validatorService: ValidatorService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {
    super(location);
  }

  abstract buildForm(): void;

  loadPageData(buildFormFunction): void {
    this.loading = false;

    const id = this.activatedRoute.snapshot.params["id"];
    const businessId = this.activatedRoute.snapshot.params["businessId"];

    this.personService
      .get(id)
      .flatMap(person => {
        this.person = person;
        return this.businessService.getBusinesses();
      })
      .subscribe(
        businesses => {
          if (businessId) {
            businesses = _.filter(<BusinessSummary[]>businesses, b => {
              return b.id === businessId;
            });
          }

          businesses.forEach(s => {
            this.businesses.push({ label: s.name, value: s.id });
          });

          this.setDefaultObject(this.businesses);

          if (this.person.businessId) {
            this.selectedBusiness = this.person.businessId;
          }

          if (businessId) {
            this.person.businessId = businessId;
          }
        },
        error => {
          this.errors.push({
            severity: "error",
            summary: "Person Error",
            detail: error
          });
        },
        () => {
          this.buildForm();
          this.loaded = true;
          this.loading = false;
        }
      );
  }

  public addBusinessToList(business: any) {
    this.businesses.push({ label: business.name, value: business.id });
  }

  public goBack(): void {
    this.location.back();
  }
}
