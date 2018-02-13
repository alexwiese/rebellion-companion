import { Component, OnInit } from '@angular/core';
import { System, Coruscant, RebelBase } from '../models/models';
import { StateService } from '../state.service';

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['../build/build.component.scss', './probe.component.scss']
})
export class ProbeComponent implements OnInit {

  hideProbed: boolean;
  hideInvaded: boolean;
  hideLoyalty: boolean;

  public get systems(): System[] {
    return this.stateService.systems
      .filter(s => this.hideProbed ? !s.probed : true)
      .filter(s => this.hideInvaded ? !s.hadImperialGroundTroops : true)
      .filter(s => this.hideLoyalty ? !s.hadImperialLoyalty : true)
      .filter(s => !(s instanceof Coruscant) && !(s instanceof RebelBase));
  }

  public get discoveredCount(): number {
    return this.stateService.systems.filter(s => s.probed || s.hadImperialGroundTroops || s.hadImperialLoyalty).length 
    / (this.stateService.systems.length - 2); // Account for base and Coruscant
  }

  constructor(
    private stateService: StateService) {
  }

  ngOnInit() {
  }

  public reset() {
    this.stateService.resetProbes();
  }

  public toggleHideProbed() {
    this.hideProbed = !this.hideProbed;
  }
  public toggleHideInvaded() {
    this.hideInvaded = !this.hideInvaded;
  }
  public toggleHideLoyalty() {
    this.hideLoyalty = !this.hideLoyalty;
  }
}
