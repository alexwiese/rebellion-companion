import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { WorkInstructionSummary } from "../models/workinstructions/workinstruction-summary";
import {
  WorkInstructionDetail,
  WorkInstructionType
} from "../models/workinstructions/workinstruction-detail";
import {
  WorkInstructionTask,
  WorkInstructionTaskServiceFrequency
} from "../models/workinstructions/workinstructiontask";
import { AssetType } from "app/models/assets/asset";
import { AuthHttp } from "./auth.http";
import { BaseService } from "../services/base.service";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Injectable()
export class WorkInstructionService extends BaseService {
  baseUrl = "api/workinstructions/";
  safetyInstructionsUrl = "api/safetyinstructions/";
  tasksUrl = "api/workinstructiontasks/";

  constructor(public http: AuthHttp, authService: AuthService, router: Router) {
    super(authService, router);
  }

  getWorkInstructionTaskServiceNameValues(): string[] {
    return ["Weight", "Length"];
  }

  getWorkInstructionTaskServiceUOMs(): string[] {
    return ["KG", "CM", "MM"];
  }

  getSafetyInstruction() {
    const url = this.safetyInstructionsUrl;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionDetails(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructions() {
    const url = this.baseUrl;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionDetails(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructionsByType(type: WorkInstructionType) {
    const url = this.baseUrl + "fortype/" + type;

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionSummary(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructionsForUser(): Observable<WorkInstructionSummary> {
    const url = this.baseUrl + "foruser";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionSummary(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructionTasks(id: string) {
    const url = this.baseUrl + id + "/tasks";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionTask(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructionServiceFreqencies(): Observable<WorkInstructionTaskServiceFrequency[]> {
    const url = this.tasksUrl + "servicefrequencies";

    return this.http
      .get(url)
      .map((response: Response) => {
        return (<any>response.json()).map(item => {
          return this.transformWorkInstructionTaskServiceFrequency(item);
        });
      })
      .catch(this.handleError);
  }

  getWorkInstructionTask(id: string) {
    const url = this.tasksUrl + id;

    if (!id) {
      return Observable.of(new WorkInstructionTask(this.getEmptyGuid()));
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformWorkInstructionTask(item);
      })
      .catch(this.handleError);
  }

  getWorkInstruction(id?: string) {
    const url = this.baseUrl + id;

    if (!id) {
      return Observable.of(new WorkInstructionDetail(this.getEmptyGuid()));
    }

    return this.http
      .get(url)
      .map((response: Response) => {
        const item = <any>response.json();
        return this.transformWorkInstructionDetails(item);
      })
      .catch(this.handleError);
  }

  private transformWorkInstructionTask(item: any) {
    const task = new WorkInstructionTask(
      item.id,
      item.workInstructionId,
      item.workInstructionType,
      item.createDate,
      item.active,
      item.taskNumber,
      item.isMandatory,
      item.description,
      item.serviceFrequenciesSummary,
      item.serviceValueName,
      item.serviceValueUnitOfMeasure,
      item.type,
      item.isServiceValueRequired
    );

    item.serviceFrequencies.forEach(t => {
      const frequencyType = this.transformWorkInstructionTaskServiceFrequency(
        t,
        item.id
      );

      task.serviceFrequencies.push(frequencyType);
    });

    return task;
  }

  private transformWorkInstructionSummary(item: any) {
    return new WorkInstructionSummary(
      item.id,
      item.createdDate,
      item.active,
      item.name,
      item.code,
      item.souce,
      item.description,
      item.type,
      item.numberOfAssets
    );
  }

  private transformWorkInstructionTaskServiceFrequency(
    item: any,
    workInstructionTaskId: string = ""
  ) {
    return new WorkInstructionTaskServiceFrequency(
      item.serviceFrequencyId,
      item.createdDate,
      item.active,
      item.order,
      item.name,
      item.shortName,
      workInstructionTaskId
    );
  }

  private transformWorkInstructionDetails(item: any) {
    const workInstruction = new WorkInstructionDetail(
      item.id,
      item.isDefault,
      item.createdDate,
      item.active,
      item.name,
      item.code,
      item.source,
      item.description,
      item.type
    );

    if (item.assetTypes) {
      item.assetTypes.forEach(function(assetType) {
        workInstruction.assetTypes.push(
          new AssetType(
            assetType.id,
            assetType.createdDate,
            assetType.name,
            assetType.description,
            assetType.tradeType,
            assetType.defaultWorkInstructionId,
            assetType.canDelete,
            assetType.assetNames
          )
        );
      });
    }

    if (item.tasks) {
      item.tasks.forEach((t) => {
        const task = this.transformWorkInstructionTask(t);
        workInstruction.tasks.push(this.transformWorkInstructionTask(task))
      })
    }

    return workInstruction;
  }

  activateWorkInstructionTask(id: string) {
    const url = this.tasksUrl + "activate";

    return this.http
      .post(url, { id: id }, this.getRequestOptions())
      .map(response => response.json())
      .catch(this.handleError);
  }

  private createWorkInstruction(
    url: string,
    workInstruction: WorkInstructionDetail
  ) {
    return this.http
      .post(url + "create", workInstruction, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformWorkInstructionDetails(response);
      })
      .catch(this.handleError);
  }

  private editWorkInstruction(
    url: string,
    workInstruction: WorkInstructionDetail
  ) {
    return this.http
      .put(
        url + "edit/" + workInstruction.id,
        workInstruction,
        this.getRequestOptions()
      )
      .map((response: Response) => {
        return this.transformWorkInstructionDetails(response);
      })
      .catch(this.handleError);
  }

  saveWorkInstruction(workInstruction: WorkInstructionDetail) {
    const url = this.baseUrl;

    if (this.isNewObject(workInstruction)) {
      return this.createWorkInstruction(url, workInstruction);
    } else {
      return this.editWorkInstruction(url, workInstruction);
    }
  }

  private createWorkInstructionTask(
    url: string,
    workInstructionTask: WorkInstructionTask
  ) {
    return this.http
      .post(url + "create", workInstructionTask, this.getRequestOptions())
      .map((response: Response) => {
        return this.transformWorkInstructionTask(<any>response.json());
      })
      .catch(this.handleError);
  }

  private editWorkInstructionTask(
    url: string,
    workInstructionTask: WorkInstructionTask
  ) {
    return this.http
      .put(
        url + "edit/" + workInstructionTask.id,
        workInstructionTask,
        this.getRequestOptions()
      )
      .map((response: Response) => {
        return this.transformWorkInstructionTask(<any>response.json());
      })
      .catch(this.handleError);
  }

  saveWorkInstructionTask(
    workInstructionTask: WorkInstructionTask
  ): Observable<WorkInstructionTask> {
    const url = this.tasksUrl;

    if (this.isNewObject(workInstructionTask)) {
      return this.createWorkInstructionTask(url, workInstructionTask);
    } else {
      return this.editWorkInstructionTask(url, workInstructionTask);
    }
  }
}
