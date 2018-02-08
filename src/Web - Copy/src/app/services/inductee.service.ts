import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BusinessInducteeDetail } from "app/models/inductees/inductee";
import { BaseService } from "app/services/base.service";
import { AuthHttp } from "app/services/auth.http";
import { environment } from "environments/environment";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class InducteeService extends BaseService {
  baseUrl = "api/businessinductees/";
  inducteeFileUploadUrl = this.baseUrl + "uploadfiles";

  constructor(public http: AuthHttp, authService: AuthService, router: Router) {
    super(authService, router);
  }

  getBusinessInductee(id: string) {
    const url = this.baseUrl + id;
    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessInductee(item);
      })
      .catch(this.handleError);
  }

  getBusinessInductees(businessId: string, personId: string) {
    const url = this.baseUrl + businessId + "/" + personId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformBusinessInductee(item);
        });
      })
      .catch(this.handleError);
  }

  private createBusinessInductee(
    url: string,
    complianceItem: BusinessInducteeDetail
  ): Observable<BusinessInducteeDetail> {
    return this.http
      .post(url, complianceItem, this.getRequestOptions())
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessInductee(item);
      })
      .catch(this.handleError);
  }

  private editBusinessInductee(
    url: string,
    complianceItem: BusinessInducteeDetail
  ): Observable<BusinessInducteeDetail> {
    return this.http
      .put(url + complianceItem.id, complianceItem, this.getRequestOptions())
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessInductee(item);
      })
      .catch(this.handleError);
  }

  saveInductee(businessInductee: BusinessInducteeDetail) {
    const url = this.baseUrl;

    if (this.isNewObject(businessInductee)) {
      return this.createBusinessInductee(url, businessInductee);
    } else {
      return this.editBusinessInductee(url, businessInductee);
    }
  }

  private transformBusinessInductee(item: any) {
    const displayUri = (item.file && item.file.displayUri) || "";
    return new BusinessInducteeDetail(
      item.id,
      new Date(item.createDate),
      item.active,
      item.businessId,
      item.businessName,
      item.personId,
      item.personName,
      new Date(item.expiryDate),
      new Date(item.inductedDate),
      displayUri
    );
  }
}
