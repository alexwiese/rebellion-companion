import { Component, OnInit, Inject, forwardRef } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../app.component";
import { AuthService } from "../services/auth.service";
import { PersonDetail } from "../models/people/person";

@Component({
  selector: "aed-topbar",
  templateUrl: "./topbar.component.html",
  styles: [
    `.person-initials
{
    -moz-border-radius: 20px;
    border-radius: 20px;
    border-color: white;
    background-color: white;
    color: #607D8B;
    padding: 5px;
    font-size: 1.5em;
    margin: 5px;
}`
  ]
})
export class TopBarComponent implements OnInit {
  person: PersonDetail;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent
  ) {}

  ngOnInit() {
    this.getLoggedInUserDetails();

    this.authService.onLoggedIn.subscribe(() => {
      this.getLoggedInUserDetails();
    });

    this.authService.onLoggedOut.subscribe((result: any) => {
      this.person = null;
    });
  }

  getLoggedInUserDetails() {
    if (this.authService.isLoggedIn()) {
      this.authService.getPersonFromDb().subscribe(person => {
        this.person = person;
      });
    }
  }

  personInitials(): string {
    if (this.person && this.person.firstName && this.person.lastName) {
      return (
        this.person.firstName.charAt(0).toUpperCase() +
        " " +
        this.person.lastName.charAt(0).toUpperCase()
      );
    }

    return "";
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout().subscribe(result => {
      if (result) {
        // this.router.navigate(["login"]);
      }
    });
  }
}
