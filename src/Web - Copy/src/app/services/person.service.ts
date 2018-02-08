import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { PersonDetail, PersonSummary } from "app/models/people/person";
import { BaseService } from "app/services/base.service";
import { AuthHttp } from "app/services/auth.http";
import { environment } from "environments/environment";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class PersonService extends BaseService {
    baseUrl = "api/people";

    constructor(public http: AuthHttp, authService: AuthService, router: Router) {
      super(authService, router);
    }

    fileUploadUrl() {
        return environment.baseUrl + this.baseUrl + "/uploadfiles";
    }

    getAll() {
        const url = this.baseUrl + "/search";

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformPersonSummary(item);
                });
            })
            .catch(this.handleError);
    }

    getForBusiness(id: string) {
        const url = this.baseUrl + "/business/" + id;

        if (!id) {
            return Observable.of([]);
        }

        return this.http.get(url)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformPersonSummary(item);
                });
            })
            .catch(this.handleError);
    }

    get(id?: string): Observable<PersonDetail> {
        const url = this.baseUrl + "/" + id;

        if (!id) {
            return Observable.of(new PersonDetail(this.getEmptyGuid(), new Date()));
        }

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformPersonDetail(item);
            })
            .catch(this.handleError);
    }

    getSummary(id: string) {
        const url = this.baseUrl + "/summary/" + id;

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformPersonSummary(item);
            })
            .catch(this.handleError);
    }

    phoneNumberExists(phoneNumber: string) {
        const url = this.baseUrl + "/phonenumberexists/" + phoneNumber;

        return this.http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    private create(url: string, person: PersonDetail) {
        return this.http.post(url + "/create", person, this.getRequestOptions())
            .map((response: Response) => {
                return this.transformPersonDetail(response);
            })
            .catch(this.handleError);
    }

    private edit(url: string, person: PersonDetail) {
        return this.http.put(url + "/edit/" + person.id, person, this.getRequestOptions())
            .map((response: Response) => {
                return this.transformPersonDetail(response);
            })
            .catch(this.handleError);
    }

    save(person: PersonDetail) {
        const url = this.baseUrl;

        if (this.isNewObject(person)) {
            return this.create(url, person);
        } else {
            return this.edit(url, person);
        }
    }

    activate(id: string) {
        const url = this.baseUrl + "/activate";

        return this.http.post(url, { id: id }, this.getRequestOptions())
            .map(response => response.json())
            .catch(this.handleError);
    }

    transformPersonSummary(item: any) {
        const displayUri = item.image && item.image.displayUri || "";
        return new PersonSummary(item.id, item.createdDate, item.firstName, item.lastName,
            item.userName, item.email, item.businessId, item.businessName, item.phoneNumber, item.active, item.role,
            item.roleString, item.supervisorPermissions, item.fieldWorkerPermissions, item.isInducted, displayUri);
    }

    transformPersonDetail(item: any) {
        const displayUri = item.image && item.image.displayUri || "";
        const person = new PersonDetail(item.id, item.createDate, item.firstName,
            item.lastName, item.userName, item.active, item.email, item.phoneNumber, item.password,
            item.businessId, item.businessName, item.role, item.roleString, item.isPlanner,
            item.isScheduler, item.isAssetAuditor, item.isTechnician, displayUri);
        return person;
    }
}


