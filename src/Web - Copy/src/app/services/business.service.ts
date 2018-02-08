import { Injectable } from "@angular/core";
import { Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import { BaseService } from "app/services/base.service";
import { BusinessSummary } from "app/models/business/business-summary";
import {
  BusinessDetail,
  BusinessRoleType,
  BusinessType,
  IndustryType
} from "app/models/business/business-detail";
import { AuthHttp } from "app/services/auth.http";
import "rxjs/Rx";

@Injectable()
export class BusinessService extends BaseService {
  baseUrl = "api/business/";

  constructor(public http: AuthHttp, authService: AuthService, router: Router) {
    super(authService, router);
  }

  getAbn() {
    return this.http
      .get(this.baseUrl + "getabn")
      .map(response => response.json())
      .catch(this.handleError);
  }

  getBusinesses(): Observable<BusinessSummary[]> {
    const url = this.baseUrl;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return new BusinessSummary(
            item.id,
            item.identity,
            item.createdDate,
            item.name,
            item.assetOwner,
            item.assetMaintainer,
            item.active,
            item.personCount,
            item.siteCount
          );
        });
      })
      .catch(this.handleError);
  }

  getForPerson(id: string) {
    const url = "api/people/" + id + "/businesses";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return new BusinessSummary(
            item.id,
            item.identity,
            item.createdDate,
            item.name,
            item.assetOwner,
            item.assetMaintainer,
            item.active,
            item.personCount,
            item.siteCount
          );
        });
      })
      .catch(this.handleError);
  }

  getInContracts(id: string) {
    const url = "api/business/" + id + "/contracts";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return new BusinessSummary(
            item.id,
            item.identity,
            item.createdDate,
            item.name,
            item.assetOwner,
            item.assetMaintainer,
            item.active,
            item.personCount,
            item.siteCount
          );
        });
      })
      .catch(this.handleError);
  }

  getBusiness(id?: string) {
    const url = this.baseUrl + id;

    if (!id) {
      return Observable.of(
        new BusinessDetail(
          this.getEmptyGuid(),
          "",
          new Date(),
          "",
          "",
          BusinessRoleType.AssetOwner,
          BusinessType.Company,
          IndustryType.Accomodation,
          "",
          "",
          true,
          this.getEmptyGuid(),
          "",
          "",
          "",
          0,
          0,
          this.getEmptyGuid()
        )
      );
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessDetail(item);
      })
      .catch(this.handleError);
  }

  getBusinessesForAssetOwner() {
    const url = this.baseUrl + "role/" + BusinessRoleType.AssetOwner;
    return this.http
      .get(url)
      .map((response: Response) => this.transformBusinessSummaries(response))
      .catch(this.handleError);
  }

  getBusinessesForAssetMaintainer() {
    const url = this.baseUrl + "role/" + BusinessRoleType.AssetMaintainer;
    return this.http
      .get(url)
      .map((response: Response) => this.transformBusinessSummaries(response))
      .catch(this.handleError);
  }

  saveBusiness(business: BusinessDetail) {
    const url = this.baseUrl;

    if (this.isNewObject(business)) {
      return this.createBusiness(url, business);
    } else {
      return this.editBusiness(url, business);
    }
  }

  private createBusiness(url: string, business: BusinessDetail) {
    return this.http
      .post(url, business, this.getRequestOptions())
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessDetail(item);
      })
      .catch(this.handleError);
  }

  private editBusiness(url: string, business: BusinessDetail) {
    return this.http
      .put(url + business.id, business, this.getRequestOptions())
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformBusinessDetail(item);
      })
      .catch(this.handleError);
  }

  private transformBusinessDetail(item: any) {
    return new BusinessDetail(
      item.id,
      item.identity,
      item.createdDate,
      item.name,
      item.tradingName,
      item.businessRole,
      item.businessType,
      item.industry,
      item.abn,
      item.phone,
      item.active,
      item.streetAddressId,
      item.streetAddressStreet,
      item.streetAddressSuburb,
      item.streetAddressPostCode,
      item.streetAddressCountry,
      item.streetAddressRegion,
      item.mailAddressId,
      item.mailAddressStreet,
      item.mailAddressSuburb,
      item.mailAddressPostCode,
      item.mailAddressCountry,
      item.mailAddressRegion
    );
  }

  private transformBusinessSummary(item: any) {
    return new BusinessSummary(
      item.id,
      item.identity,
      item.createdDate,
      item.name,
      item.assetOwner,
      item.assetMaintainer,
      item.active,
      item.personCount,
      item.siteCount
    );
  }

  private transformBusinessSummaries(response: Response) {
    return (<any>response.json()).map(item => {
      return this.transformBusinessSummary(item);
    });
  }
}
