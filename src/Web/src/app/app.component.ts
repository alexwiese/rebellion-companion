import { Component, DoCheck } from '@angular/core';
import { StateService } from './state.service';
import { SystemStatus, System } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {

  constructor(
    private stateService: StateService) {
  }

  ngDoCheck() {
    this.stateService.save();
  }
}