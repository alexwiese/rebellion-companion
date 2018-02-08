import { Message, SelectItem } from "primeng/primeng";
import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import * as _ from "underscore";

export abstract class BaseComponent {
  errors: Message[] = [];
  successMessages: Message[] = [];
  loading = true;
  loaded = false;
  private emptyGuid = "00000000-0000-0000-0000-000000000000";

  constructor(protected location: Location) {
  }

  public goBack(): void {
    this.location.back();
  }

  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        if (container.controls[controlKey].errors) {
          errorCount += Object.keys(container.controls[controlKey].errors).length;
          console.log("Control with name " + controlKey + " has an error " + errorCount);
        }
      }
    }
    return errorCount;
  }

  public getEmptyGuid() {
    return this.emptyGuid;
  }

  filterSelectItems(event, items: SelectItem[]): SelectItem[] {
    const filteredItems: SelectItem[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.label.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  setDefaultObject(items: SelectItem[], defaultLabel: any = null) {
    if (!items) {
      items = [];
    }

    items.splice(0, 0, { label: defaultLabel, value: null });
  }

  getWindowWidth(): number {
    return window.outerWidth - 50;
  }

  getWindowHeight(): number {
    return window.outerHeight - (window.outerHeight / 4);
  }

  isEmptyGuid(value: string) {
    return value === this.emptyGuid;
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}

