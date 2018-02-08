import { Injectable } from "@angular/core";
import { Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BaseService } from "app/services/base.service";
import { SiteObjectSummary } from "app/models/siteobjects/siteobject-summary";
import { SiteObjectDetail, SiteObjectType } from "app/models/siteobjects/siteobject-detail";
import { AuthHttp } from "app/services/auth.http";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class SiteObjectService extends BaseService {
    baseUrl = "api/siteobjects";

    constructor(public http: AuthHttp, authService: AuthService, router: Router) {
      super(authService, router);
    }

    getSiteObjects() {
        const url = this.baseUrl + "/search/";

        return this.http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    filterSiteObjects(siteId?: string): Observable<SiteObjectSummary[]> {
        let url = this.baseUrl + "/search";

        if (!siteId) {
            return this.getSiteObjects();
        }

        url += "/" + siteId + "/";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transforSiteObjectSummary(item);
                });
            })
            .catch(this.handleError);
    }

    getSiteObject(id?: string): Observable<SiteObjectDetail> {
        const url = this.baseUrl + "?id=" + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();

                const address = {
                    addressId: item.addressId,
                    addressStreet: item.addressStreet,
                    addressSuburb: item.addressSuburb,
                    addressPostCode: item.addressPostCode,
                    addressRegion: item.addressRegion || 1,
                    addressCountry: item.addressCountry || 0
                }

                return new SiteObjectDetail(item.id, item.createDate, item.name, item.code, item.identity, item.legacyId, item.type,
                    item.buildingType, item.numberOfFloors, item.netLettableArea, item.totalFloorArea,
                    item.pointOfContactName, item.contactNumber, item.parkingDetails, item.additionalInformation,
                    item.siteId, item.siteName, item.businessId, item.businessName, item.active, address);
            })
            .catch(this.handleError);
    }

    saveSiteObject(siteObject: SiteObjectDetail) {
        const url = this.baseUrl + "/save";

        return this.http.post(url, siteObject, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    getSiteObjectTypeSelecItems() {
        return this.getSelectItemsFromEnum(SiteObjectType, true, false, true);
    }

    private transforSiteObjectSummary(item: any): SiteObjectSummary {
        return new SiteObjectSummary(item.id, item.createdDate, item.name, item.code, item.identity, item.type,
            item.legacyId, item.active, item.siteId, item.siteName, item.businessId, item.businessName, item.numberOfAssets,
            item.numberOfJobs);
    }

}
