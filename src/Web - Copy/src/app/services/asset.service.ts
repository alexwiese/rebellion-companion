import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import {
  Asset,
  AssetClass,
  AssetSummary,
  AssetHistory,
  AssetFile,
  AssetType,
  AssetStatusType,
  LegacyIdentity,
  AssetRelationship,
  WorkOrderAsset,
  VerificationStatusType,
  AssetSnapshot,
  SpecificAttribute
} from "../models/assets/asset";
import { AuthHttp } from "./auth.http";
import { BaseService } from "../services/base.service";
import { DateTimeService } from "../services/datetime.service";
import { environment } from "environments/environment";
import { SelectItem } from "primeng/primeng";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";
import "rxjs/add/observable/of";

@Injectable()
export class AssetService extends BaseService {
  baseUrl = "api/assets/";
  baseAssetClassUrl = "api/assetclasses/";
  baseAssetTypeUrl = "api/assettypes/";
  baseWorkOrderUrl = "api/workorders/";
  baseWorkOrderAssetUrl = "api/workorderassets/";
  baseAssetHistoryUrl = "api/assets/histories/";
  baseAssetSnapshotUrl = "api/assets/snapshot/";

  constructor(
    public http: AuthHttp,
    private dateTimeService: DateTimeService,
    authService: AuthService,
    router: Router
  ) {
    super(authService, router);
  }

  getFiles(id: string) {
    const url = this.baseUrl + id + "/getfiles";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAssetFile(item);
        });
      })
      .catch(this.handleError);
  }

  deleteFile(assetId: string, fileId: string) {
    const url = this.baseUrl + assetId + "/deleteFile/" + fileId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return Observable.of(true);
      })
      .catch(this.handleError);
  }

  getAssetClassesByLevel(level?: number) {
    return this.http
      .get(this.baseAssetClassUrl + "forlevel?level=" + level)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getAssetClasses() {
    return this.http
      .get(this.baseAssetClassUrl + "nodes")
      .map(response => response.json())
      .catch(this.handleError);
  }

  getAssetClass(id: string) {
    return this.http
      .get(this.baseAssetClassUrl + id)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getSpecificAttributes() {
    return this.http
    .get(this.baseUrl + "specificattributes")
    .map((response: Response) => {
      return (<any>response.json()).map(item => {
        return new SpecificAttribute(item.name, item.display);
      });
    })
    .catch(this.handleError);
  }

  getAssets() {
    return this.http
      .get(this.baseUrl)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAssetSummary(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkOrderAssets(
    siteObjectId: string,
    assetClassIds: string[],
    workOrderId: string
  ) {
    let url = this.baseWorkOrderAssetUrl + "?siteObjectId=" + siteObjectId;

    if (assetClassIds && assetClassIds.length) {
      assetClassIds.forEach(t => {
        url += "&assetClassIds=" + t;
      });
    }
    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkOrderAsset(item, workOrderId);
        });
      })
      .catch(this.handleError);
  }

  getAsset(id: string) {
    if (!id) {
      return Observable.of(new Asset(this.getEmptyGuid()));
    }

    return this.http
      .get(this.baseUrl + id)
      .map((response: Response) => {
        const item = <any>response.json();
        const asset = this.transformAsset(item);

        item.files.forEach(f => {
          asset.files.push(this.transformAssetFile(f));
        });

        item.legacyIdentities.forEach(i => {
          asset.legacyIdentities.push(this.transformLegacyIdentity(i));
        });

        return asset;
      })
      .catch(this.handleError);
  }

  getbyAddress(address: string) {
    return this.http
      .get(this.baseUrl + "getbyaddress/" + address)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAsset(item);
        });
      })
      .catch(this.handleError);
  }

  getByBarcode(barcode: string) {
    return this.http
      .get(this.baseUrl + "getbybarcode/" + barcode)
      .map((response: Response) => {
        const item = <any>response.json();
        const asset = this.transformAsset(item);

        return asset;
      })
      .catch(this.handleError);
  }

  getAssetTypes() {
    return this.http
      .get(this.baseAssetTypeUrl)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAssetType(item);
        });
      })
      .catch(this.handleError);
  }

  getAssetType(id: string): Observable<AssetType> {
    return this.http
      .get(this.baseAssetTypeUrl + id)
      .map((response: Response) => {
        const item = <any>response.json();
        const asset = this.transformAssetType(item);
        return asset;
      })
      .catch(this.handleError);
  }

  getAssetHistories(assetId: string) {
    const url = this.baseAssetHistoryUrl + assetId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAssetHistory(item);
        });
      })
      .catch(this.handleError);
  }

  getAssetSnapshot(
    snapshotDate: Date,
    businessId: string,
    siteId: string,
    siteObjectId?: string
  ) {
    let url =
      this.baseAssetSnapshotUrl +
      this.dateTimeService.getISODateString(snapshotDate) +
      "/" +
      businessId +
      "/" +
      siteId;

    if (siteObjectId) {
      url += "/" + siteObjectId;
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return <AssetSnapshot>this.transformAssetSummary(item);
        });
      })
      .catch(this.handleError);
  }

  filterAssets(siteId?: string, getAll: boolean = true) {
    if (!siteId && getAll) {
      return this.getAssets();
    }

    if (!siteId && !getAll) {
      return this.getEmptyList();
    }

    let url = this.baseUrl + "search";
    url += "/" + siteId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformAssetSummary(item);
        });
      })
      .catch(this.handleError);
  }

  saveAssetUploads(assets: Asset[]) {
    const url = this.baseUrl + "saveuploads";

    return this.http
      .post(url, assets, this.getRequestOptions())
      .map(response => response.json())
      .catch(this.handleError);
  }

  saveAssetClassUploads(assetClasses: any[]) {
    const url = this.baseAssetClassUrl + "saveuploads";

    return this.http
      .post(url, assetClasses, this.getRequestOptions())
      .map(response => response.json())
      .catch(this.handleError);
  }

  saveAsset(asset: Asset) {
    const url = this.baseUrl;

    if (this.isNewObject(asset)) {
      return this.createAsset(url, asset);
    } else {
      return this.editAsset(url, asset);
    }
  }

  private createAsset(url: string, asset: Asset) {
    return this.http
      .post(url, asset, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformAsset(response);
      })
      .catch(this.handleError);
  }

  private editAsset(url: string, asset: Asset) {
    return this.http
      .put(url + asset.id, asset, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformAsset(response);
      })
      .catch(this.handleError);
  }

  saveAssetType(assetType: AssetType) {
    return this.createAssetType(this.baseAssetTypeUrl, assetType);
  }

  private createAssetType(url: string, assetType: AssetType) {
    return this.http
      .post(url, assetType, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformAssetType(response);
      })
      .catch(this.handleError);
  }

  saveWorkOrderAsset(workOrderAsset: WorkOrderAsset) {
    const url = this.baseWorkOrderAssetUrl;

    if (this.isNewObject(workOrderAsset)) {
      return this.createWorkOrderAsset(url, workOrderAsset);
    }
  }

  private createWorkOrderAsset(url: string, workOrderAsset: WorkOrderAsset) {
    return this.http
      .post(url + "create", workOrderAsset, this.getRequestOptions())
      .map((response: Response) => {
        const asset = <any>response.json();
        return this.transformWorkOrderAsset(asset, asset.workOrderId);
      })
      .catch(this.handleError);
  }

  saveAssetClass(assetClass: AssetClass) {
    const url = this.baseAssetClassUrl;

    if (this.isNewObject(assetClass)) {
      return this.createAssetTask(url, assetClass);
    } else {
      return this.editAssetTask(url, assetClass);
    }
  }

  deleteAssetClass(id: string) {
    const url = this.baseAssetClassUrl + id;

    return this.http
      .delete(url)
      .map((response: Response) => {
        return Observable.of(true);
      })
      .catch(this.handleError);
  }

  deleteAssetType(id: string) {
    const url = this.baseAssetTypeUrl + id;

    return this.http
      .delete(url)
      .map((response: Response) => {
        return Observable.of(true);
      })
      .catch(this.handleError);
  }

  getRelationships(assetId: string) {
    const url = this.baseUrl + "relationships/" + assetId;

    if (!assetId || this.isEmptyGuid(assetId)) {
      return Observable.of([]);
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return new AssetRelationship(
            item.businessName,
            item.contactName,
            item.assetRelationship
          );
        });
      })
      .catch(this.handleError);
  }

  mergeAssets(
    fromWorkOrderAssetId: string,
    toWorkOrderAssetId: string
  ): Observable<Asset> {
    const url =
      this.baseWorkOrderAssetUrl +
      "merge/" +
      fromWorkOrderAssetId +
      "/" +
      toWorkOrderAssetId;

    return this.http
      .get(url)
      .map((response: Response) => {
        return this.transformAsset(response);
      })
      .catch(this.handleError);
  }

  private createAssetTask(url: string, assetClass: AssetClass) {
    return this.http
      .post(url, assetClass, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformAssetClass(response);
      })
      .catch(this.handleError);
  }

  private editAssetTask(url: string, assetClass: AssetClass) {
    return this.http
      .put(url + assetClass.id, assetClass, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformAssetClass(response);
      })
      .catch(this.handleError);
  }

  private transformAssetClass(item: any) {
    const assetClass = new AssetClass(
      item.id,
      item.createdDate,
      item.name,
      item.description,
      item.breadCrumb,
      item.level,
      item.assetTypeId,
      item.assetTypeName,
      item.assetcanDelete,
      item.parentAssetClassId
    );

    return assetClass;
  }

  transformWorkOrderAsset(item: any, workOrderId: string) {
    return new WorkOrderAsset(
      item.id,
      item.createdDate,
      item.name,
      item.identity,
      item.barcode,
      item.serialNumber,
      item.constructionTagNumber,
      item.assetId,
      workOrderId,
      item.verificationStatus,
      item.asseStatus,
      item.assetCriticality,
      item.assetCondition,
      item.maintenanceStrategy,
      item.assetTypeName,
      item.locationLevel,
      item.locationRoom,
      item.locationDescription || "",
      item.assetClassLevelOneName,
      item.siteId,
      item.siteObjectId,
      item.assetTypeId,
      item.maintenancePlanId
    );
  }

  transformAsset(item: any) {
    return new Asset(
      item.id,
      new Date(item.createdDate),
      item.name,
      item.identity,
      item.description,
      item.serialNumber,
      item.constructionTagNumber,
      item.barcode,
      item.assetStatus,
      item.assetCriticality,
      item.assetCondition,
      item.maintenanceStrategy,
      item.maintenancePlanName,
      item.maintenancePlanId,
      new Date(item.baseDate),
      item.locationLevel,
      item.locationRoom,
      item.locationDescription,
      item.longitude,
      item.latitude,
      item.assetTypeId,
      item.assetTypeName,
      item.siteId,
      item.siteObjectId,
      item.siteName,
      item.siteObjectName,
      item.businessId,
      item.assetClassHeirarchy,
      item.lastVerifiedBy,
      this.getDate(item.lastVerifiedDate),
      item.lastVerifiedStatus,
      item.assetClassId,
      this.getDate(item.manufacturedDate),
      this.getDate(item.installationDate),
      this.getDate(item.commissioningDate),
      item.equipmentAge,
      item.equipmentLocationAge
    );
  }

  transforAssetSnapshot(item: any) {
    return new AssetSnapshot(
      item.id,
      new Date(item.createdDate),
      item.name,
      item.identity,
      item.assetStatus,
      item.assetCriticality,
      item.assetCondition,
      item.siteName,
      item.siteObjectName,
      item.businessName
    );
  }

  transformAssetHistory(item: any) {
    let lastVerifiedDate = null;

    if (item.lastVerifiedDate) {
      lastVerifiedDate = new Date(item.lastVerifiedDate);
    }

    return new AssetHistory(
      item.id,
      new Date(item.createdDate),
      item.name,
      item.identity,
      item.description,
      item.serialNumber,
      item.constructionTagNumber,
      item.barcode,
      item.assetStatus,
      item.assetCriticality,
      item.assetCondition,
      item.maintenanceStrategy,
      item.maintenancePlanId,
      new Date(item.baseDate),
      item.locationLevel,
      item.locationRoom,
      item.locationDescription,
      item.longitude,
      item.latitude,
      item.assetTypeId,
      item.siteId,
      item.siteObjectId,
      item.businessId,
      item.assetClassHeirarchy,
      item.lastVerifiedBy,
      lastVerifiedDate,
      item.lastVerifiedStatus,
      item.assetClassId,
      item.businessName
    );
  }

  transformAssetSummary(item: any) {
    return new AssetSummary(
      item.id,
      item.createdDate,
      item.name,
      item.identity,
      item.assetStatus,
      item.assetCriticality,
      item.assetCondition,
      item.siteId,
      item.siteName,
      item.siteIdentity,
      item.siteAddressDisplay,
      item.siteObjectId,
      item.siteObjectName,
      item.siteObjectIdentity,
      item.siteObjectTypeName,
      item.assetClassName,
      item.assetClassLevelOneName,
      item.assetTypeName,
      item.businessId,
      item.locationLevel,
      item.locationRoom
    );
  }

  transformAssetFile(file: any) {
    return new AssetFile(
      file.id,
      file.createdDate,
      file.fileName,
      file.fileSource,
      file.originalFileName,
      file.fileType,
      file.assetName,
      file.assetId,
      file.displayUri
    );
  }

  transformLegacyIdentity(item: any) {
    return new LegacyIdentity(
      item.id,
      item.createdDate,
      item.name,
      item.source,
      item.owner,
      item.assetId
    );
  }

  transformAssetType(item: any): AssetType {
    return new AssetType(
      item.id,
      item.createdDate,
      item.name,
      item.description,
      item.tradeType,
      item.defaultWorkInstructionId,
      item.canDelete,
      item.assetNames,
      item.specificAttributes || []
    );
  }

  fileUploadUrl() {
    return environment.baseUrl + this.baseUrl + "uploadfiles";
  }

  assetRegisterFileUploadUrl() {
    return environment.baseUrl + this.baseUrl + "uploadassetregister";
  }

  assetClassRegisterFileUploadUrl() {
    return (
      environment.baseUrl + this.baseAssetClassUrl + "uploadassetclassregister"
    );
  }

  getAssetStatusSelectItems(): SelectItem[] {
    return this.getSelectItemsFromEnum(AssetStatusType, true, false, true);
  }

  getVerificationStatusSelectItems(): SelectItem[] {
    return this.getSelectItemsFromEnum(
      VerificationStatusType,
      true,
      false,
      true
    );
  }

  getAssetConditionSelecItems(): SelectItem[] {
    const assetConditions: SelectItem[] = [];

    assetConditions.push({ label: "Inoperable", value: "Inoperable" });
    assetConditions.push({ label: "Very Poor - 0%", value: "Very Poor - 0%" });
    assetConditions.push({ label: "Very Poor - 3%", value: "Very Poor - 3%" });
    assetConditions.push({ label: "Poor - 5%", value: "Poor - 5%" });
    assetConditions.push({ label: "Poor - 15%", value: "Poor - 15%" });
    assetConditions.push({ label: "Average - 30%", value: "Average - 30%" });
    assetConditions.push({ label: "Average - 50%", value: "Average - 50%" });
    assetConditions.push({ label: "Good - 70%", value: "Good - 70%" });
    assetConditions.push({ label: "Good - 80%", value: "Good - 80%" });
    assetConditions.push({
      label: "Excellent - 90%",
      value: "Excellent - 90%"
    });
    assetConditions.push({
      label: "Excellent - 100%",
      value: "Excellent - 100%"
    });

    return assetConditions;
  }
}
