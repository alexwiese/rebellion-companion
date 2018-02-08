import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  ViewChild,
  Inject,
  forwardRef
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/primeng";
import { AppComponent } from "../app.component";
import { AuthService } from "app/services/auth.service";
import { RoleType, PersonDetail } from "app/models/people/person";
import * as _ from "underscore";

@Component({
  selector: "aed-menu",
  template: `
        <ul aed-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `
})
export class MenuComponent implements OnInit {
  @Input() reset: boolean;

  model: any[];

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    private authService: AuthService
  ) {
    this.changeTheme("aedile");

    this.authService.onLoggedOut.subscribe((user: PersonDetail) => {
      this.model = [];
    });

    this.authService.onLoggedIn.subscribe((user: PersonDetail) => {
      if (this.authService.isLoggedIn()) {
        this.authService.getPersonFromDb().subscribe(person => {
          this.setModel();
        });
      }
    });
  }

  ngOnInit() {
    this.setModel();
  }

  setModel() {
    this.model = [
      {
        label: "Dashboard",
        icon: "dashboard",
        routerLink: ["/"],
        allowed: this.authService.hasPersmission(RoleType.FieldWorker)
      },
      {
        label: "Assets",
        icon: "now_widgets",
        routerLink: ["/assetlist"],
        allowed: this.authService.hasPersmission(RoleType.FieldWorker)
      },
      {
        label: "Businesses",
        icon: "business",
        routerLink: ["/businesslist"],
        allowed: this.authService.hasPersmission(RoleType.Maintainer)
      },
      {
        label: "People",
        icon: "account_box",
        routerLink: ["/peoplelist"],
        allowed: this.authService.hasPersmission(RoleType.SystemAdministrator)
      },
      {
        label: "Reports",
        icon: "poll",
        routerLink: ["/reportsdemo"],
        allowed: this.authService.hasPersmission(RoleType.Maintainer)
      },
      {
        label: "Contracts",
        icon: "library_books",
        routerLink: ["/contracts"],
        allowed: this.authService.hasPersmission(RoleType.Maintainer)
      },
      {
        label: "Work Orders",
        icon: "work",
        routerLink: ["/workorderlist"],
        allowed: this.authService.hasPersmission(RoleType.FieldWorker)
      },
      {
        label: "Admin",
        icon: "build",
        allowed: this.authService.hasPersmission(RoleType.Maintainer),
        items: [
          {
            label: "Manage",
            icon: "settings_applications",
            allowed: this.authService.hasPersmission(RoleType.Maintainer),
            items: [
              {
                label: "Asset Classes",
                icon: "class",
                routerLink: ["/assetclasslist"],
                allowed: this.authService.hasPersmission(RoleType.SystemAdministrator)
              },
              {
                label: "Work Instructions",
                icon: "event_note",
                routerLink: ["/workinstructionlist"],
                allowed: this.authService.hasPersmission(RoleType.Maintainer)
              },
              {
                label: "Compliance Items",
                icon: "verified_user",
                routerLink: ["/complianceitemlist"],
                allowed: this.authService.hasPersmission(RoleType.SystemAdministrator)
              },
              {
                label: "Manufacturers",
                icon: "toys",
                routerLink: ["/manufacturerlist"],
                allowed: this.authService.hasPersmission(RoleType.Maintainer)
              },
              {
                label: "Asset Snapshot",
                icon: "camera_enhance",
                routerLink: ["/assetsnapshot"],
                allowed: this.authService.hasPersmission(RoleType.SystemAdministrator)
              }
            ]
          },
          {
            label: "Import",
            icon: "import_export",
            allowed: this.authService.hasPersmission(RoleType.SystemAdministrator),
            items: [
              {
                label: "Asset Classes/Types",
                icon: "class",
                routerLink: ["/assetclassregister"],
                allowed: this.authService.hasPersmission(RoleType.SystemAdministrator),
              },
              {
                label: "Asset Register",
                icon: "assignment",
                routerLink: ["/assetregister"],
                allowed: this.authService.hasPersmission(RoleType.SystemAdministrator),
              }
            ]
          }
        ]
      }
    ];
  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById(
      "theme-css"
    );
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById(
      "layout-css"
    );

    themeLink.href = "assets/theme/theme-" + theme + ".css";
    layoutLink.href = "assets/layout/css/layout-" + theme + ".css";
  }
}

@Component({
  selector: "[aed-submenu]",
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
    <li  [ngClass]="{'active-menuitem': isActive(i)}" *ngIf="child.visible === false || child.allowed === false ? false : true">
        <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="!child.routerLink"
        [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
            <i class="material-icons">{{child.icon}}</i>
            <span>{{child.label}}</span>
            <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
        </a>

        <a (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="child.routerLink"
            [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
            [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
            <i class="material-icons">{{child.icon}}</i>
            <span>{{child.label}}</span>
            <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
        </a>
        <ul aed-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'"
        [visible]="isActive(i)" [reset]="reset"></ul>
    </li>
</ng-template>
    `,
  animations: [
    trigger("children", [
      state(
        "hidden",
        style({
          height: "0px"
        })
      ),
      state(
        "visible",
        style({
          height: "*"
        })
      ),
      transition(
        "visible => hidden",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      ),
      transition(
        "hidden => visible",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      )
    ])
  ]
})
export class SubMenuComponent {
  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  activeIndex: number;

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    public router: Router,
    public location: Location
  ) {}

  itemClick(event: Event, item: MenuItem, index: number) {
    // Avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // Activate current item and deactivate active sibling if any
    this.activeIndex = this.activeIndex === index ? null : index;

    // Execute command
    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }

    // Prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }

    // Hide menu
    if (!item.items) {
      if (this.app.isHorizontal()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input()
  get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && this.app.isHorizontal()) {
      this.activeIndex = null;
    }
  }
}
