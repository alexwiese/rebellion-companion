import { Component, OnInit } from '@angular/core';
import { System, SystemStatus, PopulousSystem } from '../models/models';
import { StateService } from '../state.service';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss']
})
export class BuildComponent {

  public get systems(): PopulousSystem[] {
    return this.stateService.populousSystems;
  }

  constructor(
    private stateService: StateService) {
  }

  build() {
    this.stateService.build();
  }

  reset() {
    this.stateService.reset();
  }

  get rebelSystemCount(): number {
    let count = 0;
    this.stateService.populousSystems.forEach(element => {
      if (element.status === SystemStatus.RebelLoyalty) {
        count++;
      }
    });

    return count;
  }

  get imperialSystemCount(): number {
    let count = 0;
    this.stateService.populousSystems.forEach(element => {
      if (element.status === SystemStatus.ImperialLoyalty || element.status === SystemStatus.Subjugated) {
        count++;
      }
    });

    return count;
  }
}
