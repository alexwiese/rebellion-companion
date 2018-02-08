import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthHttp } from "./auth.http";
import { PersonSummary, PersonDetail, RoleType } from "app/models/people/person";
import { PersonService } from "app/services/person.service";
import { Router } from "@angular/router";
import { JwtHelper, tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {
    authKey = "aedileAuth";
    authUserKey = "aedileUser";
    person: PersonSummary;
    token: any;
    onLoggedOut: EventEmitter<PersonSummary> = new EventEmitter();
    onLoggedIn: EventEmitter<PersonSummary> = new EventEmitter();
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: AuthHttp, private router: Router) {
    }

    login(username: string, password: string): any {
        const url = "api/accounts/generatetoken";  // JwtProvider"s LoginPath

        const data = {
            username: username,
            password: password,
            rememberMe: false,
            client_id: "AedileWebApp",
            // required when signing up with username/password
            grant_type: "password",
            // space-separated list of scopes for which the token is issued
            scope: "offline_access profile email"
        };

        return this.http.post(url, data)
            .map((response: Response) => {
                const auth = response.json();
                this.setAuth(auth);
                if (this.isLoggedIn()) {
                    this.getPersonFromDb().subscribe(
                        (person) => {
                            this.person = person;
                        }
                    );
                }
                this.onLoggedIn.emit(this.person);
                return auth;
            });
    }

    logout(): any {
        return this.http.post(
            "api/accounts/logout",
            null)
            .map(response => {
                this.onLoggedOut.emit(this.person);
                this.setAuth(null);
                this.setPersonDetails(null);
                this.person = null;
                return true;
            })
            .catch(err => {
                return Observable.throw(err);
            });
    }

    // Converts a Json object to urlencoded format
    toUrlEncodedString(data: any) {
        let body = "";

        for (const key in data) {
            if (key) {
                if (body.length) {
                    body += "&";
                }
                body += key + "=";
                body += encodeURIComponent(data[key]);
            }
        }

        return body;
    }

    setAuth(auth: any): boolean {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        } else {
            localStorage.removeItem(this.authKey);
        }
        return true;
    }

    getAuth(): any {
        const i = localStorage.getItem(this.authKey);

        if (i) {
            return JSON.parse(i);
        } else {
            return null;
        }
    }

    checkExpiration() {
        const authKey = this.getAuth();

        if (!authKey) {
            this.router.navigate(["login"]);
        }

        const token = authKey["access_token"];

        if (this.jwtHelper.isTokenExpired(token)) {
            this.router.navigate(["login"]);
        }
    }

    tokenExpired(): boolean {
        const authKey = this.getAuth();

        if (!authKey) {
            return true;
        }

        const token = authKey["access_token"];
        const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

        if (!this.jwtHelper.isTokenExpired(token)) {
            return false;
        }

        this.setAuth(null);
        this.setPersonDetails(null);
        this.person = null;

        return true;
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(this.authKey) != null && !this.tokenExpired();
    }

    hasRole(role: RoleType): boolean {
        const user = <PersonDetail>JSON.parse(localStorage.getItem(this.authUserKey));

        if (user) {
            return user.role === role;
        }

        return false;
    }

    isAdmin(): boolean {
        return this.hasRole(RoleType.SystemAdministrator);
    }

    businessId(): string {
        const user = <PersonDetail>JSON.parse(localStorage.getItem(this.authUserKey));

        if (user) {
            return user.businessId;
        }

        return "";
    }

    hasPersmission(role: RoleType): boolean {
        const user = <PersonDetail>JSON.parse(localStorage.getItem(this.authUserKey));

        if (user) {
            return user.role <= role;
        }

        return false;
    }

    getPersonFromDb() {
        return this.http.get("api/accounts/userdetails")
            .map((response) => {
                const summary = this.transformPersonSummary(response);
                this.setPersonDetails(summary);
                return summary
            });
    }

    getPersonDetails(): PersonSummary {
        const person = localStorage.getItem(this.authUserKey);

        if (person) {
            return <PersonSummary>JSON.parse(person);
        }

        return null;
    }

    setPersonDetails(person: PersonSummary): boolean {
        if (person) {
            localStorage.setItem(this.authUserKey, JSON.stringify(person));
        } else {
            localStorage.removeItem(this.authUserKey);
        }
        return true;
    }

    add(person: PersonDetail) {
        return this.http.post(
            "api/accounts",
            JSON.stringify(person),
            new RequestOptions({
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            }))
            .map(response => response.json());
    }

    update(person: PersonDetail) {
        return this.http.put(
            "api/accounts",
            JSON.stringify(person),
            new RequestOptions({
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            }))
            .map(response => response.json());
    }

    private transformPersonSummary(response: Response) {
      const item = response.json();
      const displayUri = item.image && item.image.displayUri || "";
      return new PersonSummary(item.id, item.createdDate, item.firstName, item.lastName, item.userName, item.email,
          item.businessId, item.businessName, item.phoneNumber, item.active, item.role, item.roleString, item.supervisorPermissions,
          item.fieldWorkerPermissions, item.isInducted, displayUri);
  }
}
