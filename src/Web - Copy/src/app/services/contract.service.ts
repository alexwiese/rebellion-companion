import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ContractSummary, ContractDetail, ContractFile } from "../models/contracts/contract";
import { AuthHttp } from "./auth.http";
import { BaseService } from "../services/base.service";
import { environment } from "environments/environment";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class ContractService extends BaseService {
  baseUrl = "api/contract/";

  constructor(public http: AuthHttp, authService: AuthService, router: Router) {
    super(authService, router);
  }

  getContracts() {
    const url = this.baseUrl;

    return this.http.get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformContractSummary(item);
        });
      })
      .catch(this.handleError);
  }

  getContract(id?: string) {
    const url = this.baseUrl + id;

    if (!id) {
      return Observable.of(new ContractDetail(this.getEmptyGuid()));
    }

    return this.http.get(url)
      .map((response: Response) => {
        return this.getContractDetails(response);
      })
      .catch(this.handleError);
  }

  private getContractDetails(response: Response) {
    const item = <any>response.json();
    const c = this.transformContractDetail(item);

    item.files.forEach((f) => {
      c.files.push(this.transformContractFile(f));
    });

    return c;
  }

  private createContract(url: string, contract: ContractDetail) {
    return this.http.post(url, contract, this.getRequestOptions())
      .map((response: Response) => {
        return this.getContractDetails(response);
      })
      .catch(this.handleError);
  }

  private editContract(url: string, contract: ContractDetail) {
    return this.http.put(url + contract.id, contract, this.getRequestOptions())
      .map((response: Response) => {
        return this.getContractDetails(response);
      })
      .catch(this.handleError);
  }

  saveContract(contract: ContractDetail) {
    const url = this.baseUrl;

    if (this.isNewObject(contract)) {
      return this.createContract(url, contract);
    } else {
      return this.editContract(url, contract);
    }
  }

  getFiles(id: string) {
    const url = this.baseUrl + "getfiles?id=" + id;

    return this.http.get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformContractFile(item);
        });
      })
      .catch(this.handleError);
  }

  deleteFile(id: string) {
    const url = this.baseUrl + "deleteFile?id=" + id;

    return this.http.get(url)
      .map((response: Response) => {
        return Observable.of(true);
      })
      .catch(this.handleError);
  }

  private transformContractDetail(item: any) {
    return new ContractDetail(item.id, new Date(item.createdDate), item.active, item.name, item.contactName, item.contactPhone,
      item.contactEmail, item.contactBusinessId, item.contactBusinessName, item.contractorName, item.contractorPhone, item.contractorEmail,
      item.contractorBusinessId, item.contractorBusinessName, item.contractorRole, new Date(item.tenderSubmissionDate),
      new Date(item.contractorAwardDate), new Date(item.startDate), new Date(item.endDate));
  }

  private transformContractSummary(item: any) {
    return new ContractSummary(item.id, new Date(item.createdDate), item.active, item.name, item.contactBusinessName,
      item.contractorBusinessName, item.contractorRole, new Date(item.startDate), new Date(item.endDate), item.canEdit);
  }

  transformContractFile(file: any) {
    return new ContractFile(file.id, file.createdDate, file.fileName, file.originalFileName,
      file.fileType, file.contractId, file.displayUri);
  }

  fileUploadUrl() {
    return environment.baseUrl + this.baseUrl + "uploadfiles";
  }
}
