import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule, MatListModule, MatIconModule, MatToolbar, MatToolbarModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SystemListItemComponent } from './system-list-item/system-list-item.component';


@NgModule({
  declarations: [
    AppComponent,
    SystemListItemComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    FlexLayoutModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
