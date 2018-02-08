import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AuthHttp } from "./auth.http";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import { SelectItem, Message } from "primeng/primeng";

import "rxjs/Rx";
import * as _ from "underscore";

export class BaseService {
  private emptyGuid = "00000000-0000-0000-0000-000000000000";
  public successMessages: string[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  protected handleError = (error: any) => {
    if (error && _.isString(error)) {
      return Observable.throw(error);
    }

    try {
      const errorDetails = error.json();

      if (errorDetails) {
        if (errorDetails && errorDetails.Code && errorDetails.Message) {
          return Observable.throw(
            `${errorDetails.Code}: ${errorDetails.Message}`
          );
        }

        if (errorDetails.modelState && errorDetails.modelState.vm) {
          return Observable.throw(errorDetails.modelState.vm);
        }

        if (errorDetails.message) {
          return Observable.throw(errorDetails.message);
        }

        if (_.isString(errorDetails)) {
          return Observable.throw(errorDetails);
        }

        const firstErrorProperty = errorDetails[Object.keys(errorDetails)[0]];
        if (firstErrorProperty) {
          return Observable.throw(firstErrorProperty);
        }

        return Observable.throw(errorDetails);
      }
    } catch (e) { }

    if (error.status && error.statusText.toString() === "401") {
      this.authService.logout().subscribe(() => {
        this.router.navigate(["login"]);
      });

      return Observable.throw(`${error.status}: ${error.statusText}`);
    }

    return Observable.throw("Server Error");
  }

  protected getRequestOptions() {
    return new RequestOptions({
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });
  }

  public isNewObject(obj: any) {
    if (obj && obj.id) {
      return obj.id === this.emptyGuid || obj.id === "";
    }

    return Error("No object was passed into the funtion isNewObject");
  }

  public getEmptyGuid() {
    return this.emptyGuid;
  }

  public isEmptyGuid(value: string) {
    return value === this.emptyGuid;
  }

  public getSelectItemsFromEnum(
    enumType: any,
    camelCaseToSpaces = true,
    includeEmptyRow = false,
    textOnly = false
  ): SelectItem[] {
    const selectItems: SelectItem[] = [];
    let index = 0;
    if (includeEmptyRow) {
      selectItems.push({ label: null, value: null });
    }
    for (const n in enumType) {
      if (typeof enumType[n] === "number") {
        let v = n;
        if (camelCaseToSpaces) {
          v = this.camelCaseToSpaces(n);
        }
        if (textOnly) {
          selectItems.push({ label: v, value: v });
        } else {
          selectItems.push({ label: v, value: index++ });
        }
      }
    }

    return selectItems;
  }

  camelCaseToSpaces(text: string) {
    return text.replace(/([A-Z])/g, " $1").trim();
  }

  getEmptyList() {
    return Observable.of([]);
  }

  protected getDate(item?: Date) {
    if (item) {
      return new Date(item);
    }

    return null;
  }
}
