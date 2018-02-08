import { LoginPage } from "./login.po";
import { browser } from "protractor";

describe("sbs-client login", () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();

    page.navigateTo();

    page.setUserNameText("");
    page.setPasswordText("");
  });

  it("password text should be empty", () => {
    expect(page.getPasswordText()).toEqual("");
  });

  it("username text should be empty", () => {
    expect(page.getUsernameText()).toEqual("");
  });

  it("can log in", () => {
    page.setUserNameText("ryanspears");
    page.setPasswordText("P@ssw0rd!");

    page.clickSendButton().then(() => {
      expect(browser.getCurrentUrl()).toEqual("http://localhost:49156/#/");
    });
  });
});
