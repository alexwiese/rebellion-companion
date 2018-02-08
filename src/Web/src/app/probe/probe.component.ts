import { Component, OnInit } from '@angular/core';
import { System } from '../models/models';
import { StateService } from '../state.service';

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['../build/build.component.scss', './probe.component.scss']
})
export class ProbeComponent implements OnInit {
  
  public get systems(): System[] {
    return this.stateService.systems;
  }

  constructor(
    private stateService: StateService) {
  }

  ngOnInit() {
  } 
 
  public reset(){
    this.stateService.resetProbes();
  }
}
