import { Component, OnInit, Input } from '@angular/core';
import { System } from '../models/models';

@Component({
  selector: 'probe-list-item',
  templateUrl: './probe-list-item.component.html',
  styleUrls: [ '../system-list-item/system-list-item.component.css','./probe-list-item.component.scss']
})
export class ProbeListItemComponent implements OnInit {

  @Input() system: System;

  constructor() { }

  ngOnInit() {
  }

  clicked(){
    this.system.probed = !this.system.probed ;
  }
}
