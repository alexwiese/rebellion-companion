import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class DateTimeService {

    constructor() {
    }

    addDays(date: Date, days: number): Date {
        return moment(date).add(days, "days").toDate();
    }

    getDateString(date: Date, format: string) {
        return moment(date).format(format);
    }

    datePartIsAfter(beforeDate: Date, afterDate: Date) {
        return moment(beforeDate, "day").isAfter(afterDate, "day");
    }

    getISODateString(date: Date) {
      return moment(date).toISOString();
    }

    ifBeforeToday(date: Date) {
      return moment(date).isBefore(moment(), "day");
    }
}
