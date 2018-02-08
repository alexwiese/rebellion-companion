import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CanActivate } from "@angular/router";
import { AuthService } from "app/services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.tokenExpired()) {
            this.authService.logout().subscribe(result => {
                this.goToLoginPage();
            },
                (error) => {
                    this.goToLoginPage();
                },
                () => {
                    this.goToLoginPage();
                });
            return true;
        } else {
            return true;
        }
    }

    private goToLoginPage(): boolean {
        this.router.navigate(["login"]);
        return true;
    }
}
