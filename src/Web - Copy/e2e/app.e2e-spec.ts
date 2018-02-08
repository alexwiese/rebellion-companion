import { TestNgAppPage } from "./app.po";

describe("Aedile App", () => {
  let page: TestNgAppPage;

  beforeEach(() => {
    page = new TestNgAppPage();
  });

  it("should display Welcome after successful login", () => {
    page.navigateTo();
    expect(page.getHeaderText()).toStartWith("Welcome ");
  });
});
