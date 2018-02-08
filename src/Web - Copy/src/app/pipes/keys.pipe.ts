import { PipeTransform, Pipe } from "@angular/core";

@Pipe({name: "keys"})
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
        if (key.hasOwnProperty(key)) {
            keys.push({ key: key, value: value[key]});
        }
    }
    return keys;
  }
}
