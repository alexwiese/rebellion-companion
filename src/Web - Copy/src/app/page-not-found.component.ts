import { Component } from "@angular/core";

@Component({
    selector: "aed-page-not-found",
    template: `<div class="container">
        <h2>{{title}}</h2>
        <div>
            Oops.. This page does not exist (yet!).
        </div>
        </div>
    `
})

export class PageNotFoundComponent {
    title = "Page not Found";
}
