import { browser, by, element, protractor } from "protractor";

export class LoginPage {
  navigateTo() {
    return browser.get("#/login");
  }

  getUsernameText() {
    return element(by.css("aed-login #username")).getText();
  }

  getPasswordText() {
    return element(by.css("aed-login #password")).getText();
  }

  setUserNameText(text) {
    element(by.css("aed-login #username")).sendKeys(text);
  }

  setPasswordText(text) {
    element(by.css("aed-login #password")).sendKeys(text);
  }

  clickSendButton() {
    return element(by.buttonText(`Sign In`)).click();
  }

  clickLogoutButton() {
    const e = element(by.css("#logout"));

    if (e.isPresent()) {
      return e.click();
    }

    return protractor.promise.defer().promise;
  }
}
