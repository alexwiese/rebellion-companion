import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  Panel,
  InputText,
  Password,
  Button,
  Messages,
  Message
} from "primeng/primeng";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "aed-login",
  templateUrl: "./login.component.html",
  styles: [`.aed-row { margin-bottom: 10px;`]
})
export class LoginComponent {
  title = "Login";
  loginForm = null;
  errors: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([""]);
    }
    this.loginForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  performLogin(e) {
    e.preventDefault();
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.errors = [];

    this.authService.login(username, password).subscribe(
      data => {
        this.authService.getPersonFromDb().subscribe(
          () => {
            this.router.navigate([""]);
          },
          error => {
            this.errors.push({
              severity: "error",
              summary: "Login Error",
              detail: error.json()
            });
          }
        );
      },
      error => {
        this.errors.push({
          severity: "error",
          summary: "",
          detail: error.json()
        });
      }
    );
  }
}
