import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
declare var BarcodeReader: any;

@Injectable()
export class BarcodeService {

    constructor() {
        BarcodeReader.Init();
    }

    getBarcode(image: any, imageCallBack) {
        BarcodeReader.SetImageCallback(imageCallBack);
        BarcodeReader.DecodeImage(image);
    }
}
