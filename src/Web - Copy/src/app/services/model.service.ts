import { Injectable } from "@angular/core";
import { AuthHttp } from "./auth.http";
import { BaseService } from "../services/base.service";
import { ManufacturerDetail, ManufacturerSummary } from "app/models/models/manufacturer-summary"
import { ModelSummary } from "app/models/models/model-summary"
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ModelService extends BaseService {

    baseUrl = "api/manufacturers/";

    constructor(public http: AuthHttp, authService: AuthService, router: Router) {
      super(authService, router);
    }

    getManufacturers() {
        return this.http.get(this.baseUrl)
            .map((response: Response) => {
                return (<any>response.json()).map(item => {
                    return this.transformManufacturerSummary(item);
                });
            })
            .catch(this.handleError);
    }

    getManufacturer(id?: string) {
        const url = this.baseUrl + id;

        if (!id) {
            return Observable.of(new ManufacturerDetail(this.getEmptyGuid()));
        }

        return this.http.get(url)
            .map((response: Response) => {
                const item = <any>response.json();
                return this.transformManufacturerDetail(item);
            })
            .catch(this.handleError);
    }

    private create(url: string, manufacturer: ManufacturerDetail) {
        return this.http.post(url + "create", manufacturer, this.getRequestOptions())
            .map((response: Response) => {
                return this.transformManufacturerDetail(response);
            })
            .catch(this.handleError);
    }

    private edit(url: string, manufacturer: ManufacturerDetail) {
        return this.http.put(url + "edit/" + manufacturer.id, manufacturer, this.getRequestOptions())
            .map((response: Response) => {
                return this.transformManufacturerDetail(response);
            })
            .catch(this.handleError);
    }

    delete(id: string) {
        const url = this.baseUrl + id;

        return this.http.delete(url)
            .map((response: Response) => {
                return Observable.of(true);
            })
            .catch(this.handleError);
    }

    save(manufacturer: ManufacturerDetail) {
        const url = this.baseUrl;

        if (this.isNewObject(manufacturer)) {
            return this.create(url, manufacturer);
        } else {
            return this.edit(url, manufacturer);
        }
    }

    getModels(id: string) {
        if (!id) {
            return Observable.of([]).map(data => {
                return data;
            });
        }

        return this.http.get(this.baseUrl + "getmodels/" + id)
            .map(response => response.json())
            .catch(this.handleError);
    }

    private transformManufacturerDetail(item: any) {
        const manufacturer = new ManufacturerDetail(item.id, item.createdDate, item.name, item.canDelete, item.active);

        if (item.models && item.models.length > 0) {
            item.models.forEach((m) => {
                const model = new ModelSummary(m.id, m.createdDate, m.name, m.manufacturerName, m.active, m.assetTypeName);
                manufacturer.models.push(model);
            });
        }

        return manufacturer;
    }

    private transformManufacturerSummary(item: any) {
        return new ManufacturerSummary(item.id, item.createdDate, item.name, item.canDelete, item.active, item.modelCount);
    }
}
