import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import {
  WorkOrderDetail,
  WorkOrderType,
  WorkOrderStatus,
  WorkOrderAssetClass
} from "../models/workorders/workorder-detail";
import { AuthHttp } from "./auth.http";
import { BaseService } from "app/services/base.service";
import { AssetService } from "app/services/asset.service";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class WorkOrderService extends BaseService {
  baseUrl = "api/workorders/";

  constructor(
    public http: AuthHttp,
    authService: AuthService,
    router: Router,
    private assetService: AssetService
  ) {
    super(authService, router);
  }

  getForUser(): Observable<WorkOrderDetail> {
    const url = this.baseUrl + "foruser";

    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformWorkOrderDetails(item);
      })
      .catch(this.handleError);
  }

  getWorkOrder(id?: string) {
    const url = this.baseUrl + id;

    if (!id) {
      return Observable.of(new WorkOrderDetail(this.getEmptyGuid()));
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformWorkOrderDetails(item);
      })
      .catch(this.handleError);
  }

  getWorkOrdersForAsset(assetId: string) {
    const url = this.baseUrl + "forasset/" + assetId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkOrderDetails(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkOrders() {
    const url = this.baseUrl;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkOrderDetails(item);
        });
      })
      .catch(this.handleError);
  }

  private transformWorkOrderAssetClass(item: any): WorkOrderAssetClass {
    return new WorkOrderAssetClass(
      item.workOrderId,
      item.workOrderName,
      item.assetClassId,
      item.assetClassName
    );
  }

  private transformWorkOrderDetails(item: any) {
    const workOrder = new WorkOrderDetail(
      item.id,
      item.createdDate,
      this.getDate(item.requiredDate),
      this.getDate(item.startDate),
      this.getDate(item.completedDate),
      item.active,
      item.name,
      item.identity,
      item.description,
      item.additionalInformation,
      item.type,
      item.status,
      item.tradeType,
      item.priority,
      item.assetId,
      item.assetName,
      item.assetIdentity,
      item.hasAssetDetails,
      item.businessId,
      item.businessName,
      item.personId,
      item.resource,
      item.siteId,
      item.siteName,
      item.siteIdentity,
      item.siteObjectId,
      item.siteObjectName,
      item.siteObjectIdentity,
      item.assetClassLevelOneName
    );

    if (item.businesses) {
      item.businesses.forEach(i => {
        workOrder.businesses.push(i);
      });
    }

    if (item.assets && item.assets.length > 0) {
      item.assets.forEach(f => {
        workOrder.assets.push(
          this.assetService.transformWorkOrderAsset(f, item.id)
        );
      });
    }

    if (item.assetClasses && item.assetClasses.length > 0) {
      item.assetClasses.forEach(f => {
        workOrder.assetClasses.push(this.transformWorkOrderAssetClass(f));
      });
    }

    return workOrder;
  }

  private createWorkOrder(url: string, workOrder: WorkOrderDetail) {
    return this.http
      .post(url, workOrder, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformWorkOrderDetails(response);
      })
      .catch(this.handleError);
  }

  private editWorkOrder(url: string, workOrder: WorkOrderDetail) {
    return this.http
      .put(url + workOrder.id, workOrder, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformWorkOrderDetails(response);
      })
      .catch(this.handleError);
  }

  saveWorkOrder(workOrder: WorkOrderDetail) {
    const url = this.baseUrl;

    if (this.isNewObject(workOrder)) {
      return this.createWorkOrder(url, workOrder);
    } else {
      return this.editWorkOrder(url, workOrder);
    }
  }
}
