import { AssetType, WorkOrderAsset } from "../models/assets/asset";
import {
  WorkOrderDetail,
  WorkOrderType
} from "../models/workorders/workorder-detail";
import { Injector, ReflectiveInjector } from "@angular/core";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Http } from "@angular/http";
import { AuthHttp } from "./auth.http";
import { DateTimeService } from "../services/datetime.service";
import { environment } from "../../environments/environment";
import * as _ from "underscore";
import * as moment from "moment";
import "rxjs/Rx";
export interface ValidationResult {
  [key: string]: boolean;
}

@Injectable()
export class ValidatorService {
  static abnValidator(control: FormControl): { [s: string]: boolean } {
    let abn = control.value;

    if (abn.length !== 11) {
      return { invalidAbn: true };
    }

    // Subtract 1 from the first digit
    abn = (parseInt(abn.charAt(0), 10) - 1).toString() + abn.slice(1);

    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    // Abn needs 11 character
    if (abn.length !== 11) {
      return { invalidAbn: true };
    }

    // Get weighted sum
    let weightedSum = 0;

    for (let i = 0; i < 11; i++) {
      weightedSum += parseInt(abn.charAt(i), 10) * weights[i];
    }

    // Get remainder of weighted sum mod 89
    const remainder = weightedSum % 89;

    // If remainder is not 0 the not ABN
    if (remainder !== 0) {
      return { invalidAbn: true };
    }
  }

  static dateAfterTodayValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return;
    }

    const now = new Date(control.value);

    const afterToday = moment(now).isAfter(moment(), "day");

    if (afterToday) {
      return { dateIsAfterToday: true };
    }
  }

  static emailValidator(control: FormControl): { [s: string]: boolean } {
    const regexString = /[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5}/;
    const emailRegex = new RegExp(regexString);

    if (emailRegex.test(control.value) === false) {
      return { invalidEmail: true };
    }
  }

  static passwordValidator(control: FormControl): { [s: string]: boolean } {
    const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()]{8,}$/;
    const passwordRegex = new RegExp(regexString);

    if (
      passwordRegex.test(control.value) === false &&
      control.value.length > 0
    ) {
      return { invalidPassword: true };
    }
  }

  static barcodeValidator(control: FormControl): { [s: string]: boolean } {
    const regexString = /^(\d{12}|\d{14})$/;
    const barcodeRegex = new RegExp(regexString);

    if (barcodeRegex.test(control.value) === false && control.value !== "") {
      return { invalidBarcode: true };
    }
  }

  static phoneValidator(control: FormControl): { [s: string]: boolean } {
    const regexString = /^[0-9]+([0-9]* *)+$/;
    const phoneRegex = new RegExp(regexString);

    if (phoneRegex.test(control.value) === false) {
      return { invalidPhoneNumber: true };
    }
  }

  static phoneNumberExists(
    authHttp: AuthHttp,
    id?: string
  ): { [s: string]: any } {
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url = "api/people/phonenumberexists/" + control.value;
        let timer;

        if (control.value.length < 3) {
          resolve(null);
        }

        if (id) {
          url += "/" + id;
        }

        timer = setTimeout(() => {
          authHttp
            .get(url)
            .map(res => res.json())
            .subscribe(
              data => {
                if (data) {
                  resolve({ phoneExistsValidator: true });
                } else {
                  resolve(null);
                }
              },
              error => {
                resolve(null);
              }
            );
        }, 500);
      });
    };
  }

  static emailExists(authHttp: AuthHttp, id?: string): { [s: string]: any } {
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url = "api/people/emailexists/" + control.value;
        let timer;

        if (control.value.length < 3) {
          resolve(null);
        }

        if (id) {
          url += "/" + id;
        }

        timer = setTimeout(() => {
          authHttp
            .get(url)
            .map(res => res.json())
            .subscribe(
              data => {
                if (data) {
                  resolve({ emailExistsValidator: true });
                } else {
                  resolve(null);
                }
              },
              error => {
                resolve(null);
              }
            );
        }, 500);
      });
    };
  }

  static nameExists(authHttp: AuthHttp, id?: string): { [s: string]: any } {
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url = "api/people/nameexists/" + control.value;
        let timer;

        if (control.value.length < 3) {
          resolve(null);
        }

        if (id) {
          url += "/" + id;
        }

        timer = setTimeout(() => {
          authHttp
            .get(url)
            .map(res => res.json())
            .subscribe(
              data => {
                if (data) {
                  resolve({ nameExistsValidator: true });
                } else {
                  resolve(null);
                }
              },
              error => {
                resolve(null);
              }
            );
        }, 500);
      });
    };
  }

  static contractNameExists(
    authHttp: AuthHttp,
    id?: string
  ): { [s: string]: any } {
    let timer;

    return (control: FormControl) => {
      return new Promise(resolve => {
        let url = "api/contract/nameexists?name=" + control.value;

        if (control.value.length < 3) {
          resolve(null);
        }

        if (id) {
          url += "&contractId=" + id;
        }

        timer = setTimeout(() => {
          authHttp
            .get(url)
            .map(res => res.json())
            .subscribe(
              data => {
                if (data) {
                  resolve({ contractNameExistsValidator: true });
                } else {
                  resolve(null);
                }
              },
              error => {
                resolve(null);
              }
            );
        }, 500);
      });
    };
  }

  static compareAsync(controlOne: string, controlTwo: string) {
    return (control: FormControl): { [s: string]: any } => {
      return new Promise(resolve => {
        const password = control.parent.controls[controlOne];
        const confirmPassword = control.parent.controls[controlTwo];

        if (password.value === confirmPassword.value) {
          if (password.errors && password.errors.compareFailed) {
            delete password.errors.compareFailed;
          }

          if (confirmPassword.errors && confirmPassword.errors.compareFailed) {
            delete confirmPassword.errors.compareFailed;
          }

          resolve(null);
        } else {
          resolve({ compareFailed: true });
        }
      });
    };
  }

  static workInstructionTaskServiceValueRequired(
    control: FormControl
  ): { [s: string]: boolean } {
    const value = control.value;
    const formGroup = control.parent;

    if (!formGroup) {
      return;
    }

    const required = control.parent.controls["isServiceValueRequired"].value;

    if (required && (!value || value.length === 0)) {
      return { serviceValueRequired: true };
    }
  }

  static assetClassOneRequired(control: FormControl): { [s: string]: boolean } {
    const value = control.value;
    const formGroup = control.parent;

    if (!formGroup) {
      return;
    }

    const type = control.parent.controls["type"].value;

    if (type === WorkOrderType.AssetAudit && !value) {
      return { assetClassOneRequired: true };
    }
  }

  static siteNameExists(
    authHttp: AuthHttp,
    businessId: string,
    siteId?: string
  ): { [s: string]: any } {
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url = "api/sites/sitenameexists?name=" + control.value;
        let timer;

        if (control.value.length < 3) {
          resolve(null);
        }

        if (businessId && businessId.length > 0) {
          url += "&businessId=" + businessId;
        }

        if (siteId && siteId.length > 0) {
          url += "&siteId=" + siteId;
        }

        timer = setTimeout(() => {
          authHttp
            .get(url)
            .map(res => res.json())
            .subscribe(
              data => {
                if (data) {
                  resolve({ siteNameExistsValidator: true });
                } else {
                  resolve(null);
                }
              },
              error => {
                resolve(null);
              }
            );
        }, 500);
      });
    };
  }

  static siteCodeExists(
    authHttp: AuthHttp,
    businessId: string,
    siteId?: string
  ): { [s: string]: any } {
    const baseUrl = environment.baseUrl;
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url =
          environment.baseUrl +
          "api/sites/sitecodeexists?code=" +
          control.value;

        if (businessId && businessId.length > 0) {
          url += "&businessId=" + businessId;
        }

        if (siteId && siteId.length > 0) {
          url += "&siteId=" + siteId;
        }

        authHttp
          .get(url)
          .map(res => res.json())
          .subscribe(
            data => {
              if (data) {
                resolve({ siteCodeExistsValidator: true });
              } else {
                resolve(null);
              }
            },
            error => {
              resolve(null);
            }
          );
      });
    };
  }

  static siteObjectNameExists(
    authHttp: AuthHttp,
    businessId: string,
    siteObjectId?: string
  ): { [s: string]: any } {
    const baseUrl = environment.baseUrl;
    return (control: FormControl) => {
      return new Promise(resolve => {
        let url =
          environment.baseUrl +
          "api/siteobjects/nameexists?name=" +
          control.value;

        if (businessId && businessId.length > 0) {
          url += "&businessId=" + businessId;
        }

        if (siteObjectId && siteObjectId.length > 0) {
          url += "&siteObjectId=" + siteObjectId;
        }

        authHttp
          .get(url)
          .map(res => res.json())
          .subscribe(
            data => {
              if (data) {
                resolve({ siteObjectNameExistsValidator: true });
              } else {
                resolve(null);
              }
            },
            error => {
              resolve(null);
            }
          );
      });
    };
  }
}
