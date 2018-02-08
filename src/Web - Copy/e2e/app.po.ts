import { browser, by, element } from "protractor";

export class TestNgAppPage {
  navigateTo() {
    return browser.get("/");
  }

  getHeaderText() {
    return element(by.css("aed-dashboard h3")).getText();
  }
}
