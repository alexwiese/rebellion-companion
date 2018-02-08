import { TaskRunner } from "protractor/built/taskRunner";
import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";

import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";

enum MenuOrientation {
  STATIC,
  OVERLAY,
  HORIZONTAL
}

declare var jQuery: any;

@Component({
  selector: "aed-app",
  templateUrl: "./app.component.html"
})
export class AppComponent implements AfterViewInit, OnDestroy {
  layoutCompact = false;

  layoutMode: MenuOrientation = MenuOrientation.STATIC;

  darkMenu = false;

  profileMode = "inline";

  rotateMenuButton: boolean;

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  layoutContainer: HTMLDivElement;

  layoutMenuScroller: HTMLDivElement;

  layoutMainContainer: HTMLDivElement;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  documentClickListener: Function;

  resetMenu: boolean;

  displayMenu = false;

  @ViewChild("layoutContainer") layourContainerViewChild: ElementRef;

  @ViewChild("layoutMenuScroller") layoutMenuScrollerViewChild: ElementRef;

  @ViewChild("layoutMainContainer") layoutMainViewChild: ElementRef;

  constructor(
    public renderer: Renderer,
    public authService: AuthService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) {}

  private displayLayoutMenu() {
    console.log("displayLayoutMenu(): " + new Date());
    jQuery(this.layoutMainContainer).css({ "margin-left": "250px" });
    this.displayMenu = true;
  }

  private hideLayoutMenu() {
    console.log("hideLayoutMenu(): " + new Date());
    jQuery(this.layoutMainContainer).css({ "margin-left": "0" });
    this.displayMenu = false;
    this.router.navigate(["login"]);
  }

  ngAfterViewInit() {
    console.log("app.component.ngAfterViewInit(): " + new Date());

    this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild
      .nativeElement;
    this.layoutMenuScroller = <HTMLDivElement>this.layoutMenuScrollerViewChild
      .nativeElement;
    this.layoutMainContainer = <HTMLDivElement>this.layoutMainViewChild
      .nativeElement;

    // hides the horizontal submenus or top menu if outside is clicked
    this.documentClickListener = this.renderer.listenGlobal(
      "body",
      "click",
      event => {
        if (!this.topbarItemClick) {
          this.activeTopbarItem = null;
          this.topbarMenuActive = false;
        }

        if (!this.menuClick && this.isHorizontal()) {
          this.resetMenu = true;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
      }
    );

    setTimeout(() => {
      jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
    }, 100);

    this.authService.onLoggedIn.subscribe(() => {
      console.log("login(): " + new Date());
      this.displayLayoutMenu();
    });

    this.authService.onLoggedOut.subscribe((result: any) => {
      console.log("logout(): " + new Date());
      this.hideLayoutMenu();
    });

    if (this.authService.isLoggedIn()) {
      this.displayLayoutMenu();
    } else {
      this.hideLayoutMenu();
    }

    this.changeRef.detectChanges();
  }

  showMenu(): boolean {
    return this.displayMenu;
  }

  onMenuButtonClick(event) {
    this.rotateMenuButton = !this.rotateMenuButton;
    this.topbarMenuActive = false;

    if (this.layoutMode === MenuOrientation.OVERLAY) {
      this.overlayMenuActive = !this.overlayMenuActive;
    } else {
      if (this.isDesktop()) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        this.staticMenuMobileActive = !this.staticMenuMobileActive;
      }
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;

    if (!this.isHorizontal()) {
      setTimeout(() => {
        jQuery(this.layoutMenuScroller).nanoScroller();
      }, 500);
    }
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    if (this.overlayMenuActive || this.staticMenuMobileActive) {
      this.rotateMenuButton = false;
      this.overlayMenuActive = false;
      this.staticMenuMobileActive = false;
    }

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.layoutMode === MenuOrientation.OVERLAY;
  }

  isHorizontal() {
    return this.layoutMode === MenuOrientation.HORIZONTAL;
  }

  changeToStaticMenu() {
    this.layoutMode = MenuOrientation.STATIC;
  }

  changeToOverlayMenu() {
    this.layoutMode = MenuOrientation.OVERLAY;
  }

  changeToHorizontalMenu() {
    this.layoutMode = MenuOrientation.HORIZONTAL;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }

    jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
  }
}
