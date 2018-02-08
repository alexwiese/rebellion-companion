import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatListModule, MatIconModule, MatToolbar, MatToolbarModule, MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SystemListItemComponent } from './system-list-item/system-list-item.component';
import { ProbeComponent } from './probe/probe.component';
import { BuildComponent } from './build/build.component';
import { StateService } from './state.service';
import { ProbeListItemComponent } from './probe-list-item/probe-list-item.component';


@NgModule({
  declarations: [
    AppComponent,
    SystemListItemComponent,
    ProbeComponent,
    BuildComponent,
    ProbeListItemComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatTabsModule,
    BrowserAnimationsModule
  ],
  providers: [StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
