import { Injectable } from '@angular/core';
import { System, Board, Faction, SystemStatus, PopulousSystem } from './models/models';

@Injectable()
export class StateService {

  public board = new Board();

  public get systems(): System[] {
    return (Object.keys(this.board.systems).map(k => this.board.systems[k]) as System[]);
  }

  public get populousSystems(): PopulousSystem[] {
    return (Object.keys(this.board.systems).map(k => this.board.systems[k]).filter(p => p instanceof PopulousSystem) as PopulousSystem[]);
  }

  constructor() {
    if (localStorage.getItem('lastState')) {
      try {
        const state = JSON.parse(localStorage.getItem('lastState')) as Board;
        (Object.keys(state.systems).map(k => state.systems[k]) as System[]).forEach((element: any) => {

          if (element.status) {
            (this.board.systems[element.name] as PopulousSystem).status = (element._status || element.status);
          }

          this.board.systems[element.name].probed = element.probed;
          this.board.systems[element.name].hadImperialGroundTroops = element.hadImperialGroundTroops;
          this.board.systems[element.name].hadImperialLoyalty = element.hadImperialLoyalty;
        });
      }
      catch{
        this.board = new Board();
      }
    }
  }

  build() {
    alert("Rebels:\r\n" + (this.board.getFormattedBuildResults(Faction.Rebellion) || "Nothing"));
    alert("Empire:\r\n" + (this.board.getFormattedBuildResults(Faction.Empire) || "Nothing"));
  }

  reset() {
    this.populousSystems.forEach(system => {
      system.status = SystemStatus.Neutral;

      if(system.name === "Rebel Base")
      {
        system.status = SystemStatus.RebelLoyalty;
      }

      if(system.name === "Coruscant")
      {
        system.status = SystemStatus.ImperialLoyalty;
      }
    });
  }

  resetProbes(): void {

    this.systems.forEach(system => {
      system.probed = false;
      system.hadImperialGroundTroops = false;
      system.hadImperialLoyalty = false;
    });
  }

  save() {
    localStorage.setItem('lastState', JSON.stringify(this.board));
  }

}
