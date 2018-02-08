import { BaseComponent } from "../shared/base.component";
import * as _ from "underscore";

export class PagerComponent<T> extends BaseComponent {
    items: T[];
    numberOfItems = 0;
    selectedItem: T;

    public setItems(items: T[]) {
        this.items = items;
        this.numberOfItems = this.items.length;
    }

    public getHeaderInfo(dt: any, header: string) {
      if (dt && dt.value && header) {
        const page = parseInt(dt._first, 10);
        const rows = parseInt(dt.rows, 10);
        const total = parseInt(dt._totalRecords, 10);
        const allRecords = parseInt(dt.value.length, 10);
        const firstRecord = page + 1;
        let lastRecord = page + rows;

        if (lastRecord > total) {
          lastRecord = total;
        }

        if (total === 0) {
          return `${header} (${allRecords}): 0 of 0`;
        }

        return `${header} (${allRecords}): ${firstRecord} - ${lastRecord} of ${total}`;
      }

      return "";
    }
}
