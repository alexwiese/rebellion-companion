import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SystemStatus, System } from '../app.component';

@Component({
  selector: 'system-list-item',
  templateUrl: './system-list-item.component.html',
  styleUrls: ['./system-list-item.component.css']
})
export class SystemListItemComponent implements OnInit {

  constructor() { }

  @Input() system: System;

  ngOnInit() {
  }

  sabotageClicked() {
    this.system.status = this.system.status === SystemStatus.Sabotaged ? SystemStatus.Neutral : SystemStatus.Sabotaged;
  }

  rebellionClicked() {
    this.system.status = this.system.status === SystemStatus.RebelLoyalty ? SystemStatus.Neutral : SystemStatus.RebelLoyalty;
  }

  subjugationClicked() {
    this.system.status = this.system.status === SystemStatus.Subjugated ? SystemStatus.Neutral : SystemStatus.Subjugated;
  }

  empireClicked() {
    this.system.status = this.system.status === SystemStatus.ImperialLoyalty ? SystemStatus.Neutral : SystemStatus.ImperialLoyalty;
  }
}
