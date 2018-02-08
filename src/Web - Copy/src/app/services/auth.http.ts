import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthHttp {
    http = null;
    authKey = "aedileAuth";
    baseUrl = "";

    constructor(http: Http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }

    get(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.get(this.baseUrl  + url, opts);
    }

    post(url, data, opts = {}) {
        this.configureAuth(opts);
        return this.http.post(this.baseUrl + url, data, opts);
    }

    put(url, data, opts = {}) {
        this.configureAuth(opts);
        return this.http.put(this.baseUrl + url, data, opts);
    }

    delete(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.delete(this.baseUrl + url, opts);
    }

    configureAuth(opts: any) {
        const i = localStorage.getItem(this.authKey);
        if (i != null) {
            const auth = JSON.parse(i);
            if (auth.access_token != null) {
                if (opts.headers == null) {
                    opts.headers = new Headers();
                }
                opts.headers.set("Authorization", `Bearer ${auth.access_token}`);
            }
        }
    }
}
