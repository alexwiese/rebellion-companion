import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BusinessComplianceItemHeld, ComplianceItemDetail, PersonComplianceItemHeld } from "../models/compliance/compliance-detail";
import { AuthHttp } from "./auth.http";
import { BaseService } from "app/services/base.service";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";

import "rxjs/Rx";

@Injectable()
export class ComplianceItemService extends BaseService {
    baseUrl = "api/complianceitems/";
    businessUrl = "api/businesscomplianceitemsheld/";
    businessComplianceItemHeldFileUploadUrl = this.businessUrl + "uploadfiles";
    personUrl = "api/personcomplianceitemsheld/";
    personComplianceItemHeldFileUploadUrl = this.personUrl + "uploadfiles";

    constructor(public http: AuthHttp, authService: AuthService, router: Router) {
      super(authService, router);
    }

    getComplianceItems() {
        const url = this.baseUrl;

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return new ComplianceItemDetail(item.id, item.createDate, item.name,
                        item.active, item.issuingAuthority, item.type, item.level);
                });
            })
            .catch(this.handleError);
    }

    getComplianceItem(id?: string) {
        const url = this.baseUrl + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return new ComplianceItemDetail(item.id, item.createDate, item.name,
                    item.active, item.issuingAuthority, item.type, item.level);
            })
            .catch(this.handleError);
    }

    getComplianceItemsForSite(id: string) {
        const url = this.baseUrl + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return new ComplianceItemDetail(item.id, item.createDate, item.name,
                    item.active, item.issuingAuthority, item.type, item.level);
            })
            .catch(this.handleError);
    }

    getBusinessComplianceItems(businessId: string): Observable<BusinessComplianceItemHeld[]> {
        const url = this.businessUrl + "forbusiness/" + businessId;

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformBusinessComplianceItemHeld(item);
                });
            })
            .catch(this.handleError);
    }

    getBusinessComplianceItem(id: string) {
        const url = this.businessUrl + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformBusinessComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    getComplianceItemsWithBusinessTypes(): Observable<ComplianceItemDetail[]> {
        const url = this.baseUrl + "business";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformComplianceItem(item);
                });
            })
            .catch(this.handleError);
    }

    getComplianceItemsWithPersonTypes(): Observable<ComplianceItemDetail[]> {
        const url = this.baseUrl + "person";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformComplianceItem(item);
                });
            })
            .catch(this.handleError);
    }

    private createComplianceItem(url: string, complianceItem: ComplianceItemDetail) {
        return this.http.post(url, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformComplianceItem(item);
            })
            .catch(this.handleError);
    }

    private editComplianceItem(url: string, complianceItem: ComplianceItemDetail) {
        return this.http.put(url + complianceItem.id, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformComplianceItem(item);
            })
            .catch(this.handleError);
    }

    saveComplianceItem(complianceItem: ComplianceItemDetail) {
        const url = this.baseUrl;

        if (this.isNewObject(complianceItem)) {
            return this.createComplianceItem(url, complianceItem);
        } else {
            return this.editComplianceItem(url, complianceItem);
        }
    }

    private createBusinessComplianceItemHeld(url: string, complianceItem: BusinessComplianceItemHeld)
        : Observable<BusinessComplianceItemHeld> {
        return this.http.post(url, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformBusinessComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    private editBusinessComplianceItemHeld(url: string, complianceItem: BusinessComplianceItemHeld)
        : Observable<BusinessComplianceItemHeld> {
        return this.http.put(url + complianceItem.id, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformBusinessComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    saveBusinessComplianceItemHeld(complianceItemHeld: BusinessComplianceItemHeld) {
        const url = this.businessUrl;

        if (this.isNewObject(complianceItemHeld)) {
            return this.createBusinessComplianceItemHeld(url, complianceItemHeld);
        } else {
            return this.editBusinessComplianceItemHeld(url, complianceItemHeld);
        }
    }

    getPersonComplianceItems(personId: string): Observable<PersonComplianceItemHeld[]> {
        const url = this.personUrl + "forperson/" + personId;

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformPersonComplianceItemHeld(item);
                });
            })
            .catch(this.handleError);
    }

    getPersonComplianceItem(id: string) {
        const url = this.personUrl + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformPersonComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    private createPersonComplianceItemHeld(url: string, complianceItem: PersonComplianceItemHeld)
        : Observable<PersonComplianceItemHeld> {
        return this.http.post(url, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformPersonComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    private editPersonComplianceItemHeld(url: string, complianceItem: PersonComplianceItemHeld)
        : Observable<PersonComplianceItemHeld> {
        return this.http.put(url + complianceItem.id, complianceItem, this.getRequestOptions())
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformPersonComplianceItemHeld(item);
            })
            .catch(this.handleError);
    }

    savePersonComplianceItemHeld(complianceItemHeld: PersonComplianceItemHeld) {
        const url = this.personUrl;

        if (this.isNewObject(complianceItemHeld)) {
            return this.createPersonComplianceItemHeld(url, complianceItemHeld);
        } else {
            return this.editPersonComplianceItemHeld(url, complianceItemHeld);
        }
    }

    private transformComplianceItem(item: any) {
        return new ComplianceItemDetail(item.id, item.createDate, item.name, item.active, item.issuingAuthority, item.type, item.level);
    }

    private transformBusinessComplianceItemHeld(item: any) {
        const displayUri = item.file && item.file.displayUri || "";
        return new BusinessComplianceItemHeld(item.id, new Date(item.createdDate), item.active, item.complianceItemId,
            item.complianceItemName, item.businessId, item.reference, new Date(item.startDate),
            new Date(item.expiryDate), item.isVerified, item.type, displayUri, item.verifiedBy, item.verifiedDate);
    }

    private transformPersonComplianceItemHeld(item: any) {
        const displayUri = item.file && item.file.displayUri || "";
        return new PersonComplianceItemHeld(item.id, new Date(item.createdDate), item.active, item.complianceItemId,
            item.complianceItemName, item.personId, item.reference, new Date(item.startDate),
            new Date(item.expiryDate), item.isVerified, item.type, displayUri, item.verifiedBy, item.verifiedDate);
    }
}
