import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { SiteSummary } from "../models/sites/site-summary";
import { AuthHttp } from "./auth.http";
import { BaseService } from "app/services/base.service";
import { SiteDetail, SiteFile } from "app/models/sites/site-detail";
import { ComplianceItemDetail } from "app/models/compliance/compliance-detail";
import { environment } from "environments/environment";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class SiteService extends BaseService {

    baseUrl = "api/sites/";

    constructor(public http: AuthHttp, authService: AuthService, router: Router) {
      super(authService, router);
    }

    fileUploadUrl() {
        return environment.baseUrl + "uploadfiles";
    }

    getSite(id: string): Observable<SiteDetail> {
        const url = this.baseUrl + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                const site = this.transferSiteDetail(item);

                item.files.forEach((f) => {
                    site.files.push(this.transformSiteFile(f));
                });

                return site;
            })
            .catch(this.handleError);
    }

    getSites(businessId: string): Observable<SiteSummary[]> {
        const url = "api/business/" + businessId + "/sites";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return new SiteSummary(item.id, item.active, item.createDate, item.name,
                        item.code, item.identity, item.businessName, item.businessId, item.siteObjectCount, item.type);
                });
            })
            .catch(this.handleError);
    }

    getAllSites(): Observable<SiteSummary[]> {
        return this.filterSites("", "");
    }

    filterSites(businessId: string, filter: string): Observable<SiteSummary[]> {
        const url = this.baseUrl + "search?businessId=" + businessId + "&filter=" + filter;

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transforSiteSummary(item);
                });
            })
            .catch(this.handleError);
    }

    private createSite(url: string, site: SiteDetail) {
        return this.http.post(url, site, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transferSiteDetail(item);
            })
            .catch(this.handleError);
    }

    private editSite(url: string, site: SiteDetail) {
        return this.http.put(url + site.id, site, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transferSiteDetail(item);
            })
            .catch(this.handleError);
    }

    saveSite(site: SiteDetail): Observable<SiteDetail> {
        if (this.isNewObject(site)) {
            return this.createSite(this.baseUrl, site);
        } else {
            return this.editSite(this.baseUrl, site);
        }
    }

    private transforSiteSummary(item: any) {
        return new SiteSummary(item.id, item.active, item.createDate, item.name, item.code, item.identity,
            item.businessName, item.businessId, item.buildingCount);
    }

    private transferSiteDetail(item: any): SiteDetail {
        const siteDetail = new SiteDetail(item.id, item.active, item.createDate, item.name, item.code, item.description,
            item.parkingDetails, item.accessDetails, item.type, item.identity, item.businessName, item.businessId,
            item.safetyInstructionId, item.safetyInstructionName, item.addressId, item.addressStreet, item.addressSuburb,
            item.addressPostCode, item.addressRegion, item.addressCountry);

        if (item.complianceItems) {
            item.complianceItems.forEach(function (complianceItem) {
                siteDetail.complianceItems.push(new ComplianceItemDetail(complianceItem.id, complianceItem.createdDate,
                    complianceItem.name, complianceItem.active, complianceItem.issuingAuthority,
                    complianceItem.type, complianceItem.level));
            });
        }

        return siteDetail;
    }

    transformSiteFile(file: any) {
        return new SiteFile(file.id, file.createdDate, file.fileName, file.fileSource, file.originalFileName, file.fileType,
            file.siteName, file.siteId, file.displayUri);
    }

    getFiles(id: string) {
        const url = this.baseUrl + id + "/getfiles";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformSiteFile(item);
                });
            })
            .catch(this.handleError);
    }

    deleteFile(siteId: string, fileId: string) {
        const url = this.baseUrl + siteId + "/deleteFile/" + fileId;

        return this.http.get(url)
            .map((response: Response) => {
                return Observable.of(true);
            })
            .catch(this.handleError);
    }
}
