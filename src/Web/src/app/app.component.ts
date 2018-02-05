import { Component } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public board = new Board();

  public get systems(): System[] {
    return (Object.keys(this.board.systems).map(k => this.board.systems[k]) as System[]);
  }

  constructor() {
    if (localStorage.getItem('lastState')) {
      try {
        const state = JSON.parse(localStorage.getItem('lastState')) as Board;
        (Object.keys(state.systems).map(k => state.systems[k]) as System[]).forEach((element: any) => {
          this.board.systems[element.name].status = (element._status || element.status);
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
    this.board = new Board();
  }

  ngDoCheck() {
    localStorage.setItem('lastState', JSON.stringify(this.board));
  }

  get rebelSystemCount(): number {
    let count = 0;
    this.systems.forEach(element => {
      if (element.status === SystemStatus.RebelLoyalty) {
        count++;
      }
    });

    return count;
  }

  get imperialSystemCount(): number {
    let count = 0;
    this.systems.forEach(element => {
      if (element.status === SystemStatus.ImperialLoyalty || element.status === SystemStatus.Subjugated) {
        count++;
      }
    });

    return count;
  }
}

export class System {
  public status: SystemStatus;
  resources: Resource[];

  constructor(public name: string, public buildQueuePosition: number, ...params: ResourceIcon[]) {
    this.resources = params.map(r => new Resource(r, buildQueuePosition));
  }

  public getResources(faction: Faction): Resource[] {
    switch (faction) {
      case Faction.Empire:
        switch (this.status) {
          case SystemStatus.ImperialLoyalty:
            return this.resources;

          case SystemStatus.Subjugated:
            return _(this.resources).take(1);
        }
        break;

      case Faction.Rebellion:
        switch (this.status) {
          case SystemStatus.RebelLoyalty:
            return this.resources;
        }
        break;
    }

    return [];
  }
}

class Coruscant extends System {
  private _status: SystemStatus;

  get status(): SystemStatus {
    return this._status;
  }

  set status(value: SystemStatus) {
    switch (value) {
      case SystemStatus.RebelLoyalty:
      case SystemStatus.Neutral:
      case SystemStatus.Subjugated:
        return;
    }

    this._status = value;
  }

  constructor() {
    super("Coruscant", 1, ResourceIcon.BlueTriangle);
    this.status = SystemStatus.ImperialLoyalty;
  }
}

class RebelBase extends System {

  private _status: SystemStatus;

  get status(): SystemStatus {
    return this._status;
  }

  set status(value: SystemStatus) {
    switch (value) {
      case SystemStatus.ImperialLoyalty:
      case SystemStatus.Neutral:
      case SystemStatus.Subjugated:
        return;
    }

    this._status = value;
  }

  constructor() {
    super("Rebel Base", 1, ResourceIcon.BlueTriangle, ResourceIcon.YellowTriangle);
    this.status = SystemStatus.RebelLoyalty;
  }
}

enum ResourceIcon {
  BlueTriangle,
  BlueCircle,
  BlueSquare,
  YellowTriangle,
  YellowCircle,
  YellowSquare
}

export enum SystemStatus {
  Neutral,
  Sabotaged,
  RebelLoyalty,
  ImperialLoyalty,
  Subjugated,
  Blockaded
}

export enum Faction {
  Empire,
  Rebellion
}

class Resource {
  constructor(public readonly resourceIcon: ResourceIcon, public readonly buildQueuePosition: number) {
  }

  public build(faction: Faction): BuildResult {
    return new BuildResult(this.getResourceName(faction), this.buildQueuePosition);
  }

  private getResourceName(faction: Faction): string {
    switch (faction) {
      case Faction.Rebellion:
        switch (this.resourceIcon) {
          case ResourceIcon.BlueTriangle:
            return ResourceNames.XWingYWingTransport;

          case ResourceIcon.BlueCircle:
            return ResourceNames.CorellianCorvette;

          case ResourceIcon.BlueSquare:
            return ResourceNames.MonCalamariCruiser;

          case ResourceIcon.YellowTriangle:
            return ResourceNames.RebelTrooper;

          case ResourceIcon.YellowCircle:
            return ResourceNames.Airspeeder;

          case ResourceIcon.YellowSquare:
            return ResourceNames.ShieldGeneratorIonCannon;
        }

        break;

      case Faction.Empire:
        switch (this.resourceIcon) {
          case ResourceIcon.BlueTriangle:
            return ResourceNames.TieFighter;

          case ResourceIcon.BlueCircle:
            return ResourceNames.AssaultCarrier;

          case ResourceIcon.BlueSquare:
            return ResourceNames.StarDestroyer;

          case ResourceIcon.YellowTriangle:
            return ResourceNames.Stormtrooper;

          case ResourceIcon.YellowCircle:
            return ResourceNames.AtSt;

          case ResourceIcon.YellowSquare:
            return ResourceNames.AtAt;
        }

        break;
    }

    return null;
  }
}

class BuildResult {
  constructor(public name: string, public queuePosition: number) {
  }
}

namespace ResourceNames {
  export const XWingYWingTransport = "X-Wing, Y-Wing, or Rebel Transport";
  export const CorellianCorvette = "Corellian Corvette";
  export const MonCalamariCruiser = "Mon Calamari Cruiser";
  export const RebelTrooper = "Rebel Trooper";
  export const Airspeeder = "Airspeeder";
  export const ShieldGeneratorIonCannon = "Shield Generator or Ion Cannon";

  export const TieFighter = "TIE Fighter";
  export const AssaultCarrier = "Assault Carrier";
  export const StarDestroyer = "Star Destroyer";
  export const Stormtrooper = "Stormtrooper";
  export const AtSt = "AT-ST";
  export const AtAt = "AT-AT";
}

class Board {
  constructor();

  constructor(systems?: System[]) {
    this.systems = {};

    (systems || this.default()).forEach(element => {
      this.systems[element.name] = element;
    });
  }

  public default(): System[] {
    return [
      new RebelBase(),
      new System("Mon Calamari", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
      new System("Felucia", 1, ResourceIcon.YellowTriangle),
      new System("Mygeeto", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
      new System("Saleucami", 1, ResourceIcon.YellowCircle),
      new System("Kessel", 1, ResourceIcon.YellowTriangle),
      new System("Mandalore", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new System("Ord Mantell", 2, ResourceIcon.BlueCircle, ResourceIcon.YellowCircle),
      new System("Nal Hutta", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new System("Toydaria", 2, ResourceIcon.BlueCircle),
      new System("Kashyyk", 1, ResourceIcon.YellowTriangle, ResourceIcon.YellowTriangle),
      new System("Alderaan", 1, ResourceIcon.YellowTriangle),
      new System("Bothawui", 1, ResourceIcon.YellowCircle),
      new System("Malastare", 1, ResourceIcon.YellowTriangle),
      new System("Cato Neimoidia", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowCircle),
      new Coruscant(),
      new System("Rodia", 1, ResourceIcon.YellowTriangle),
      new System("Naboo", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new System("Sullust", 2, ResourceIcon.YellowTriangle, ResourceIcon.YellowSquare),
      new System("Corellia", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
      new System("Geonosis", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
      new System("Bespin", 1, ResourceIcon.YellowCircle),
      new System("Ryloth", 1, ResourceIcon.YellowTriangle),
      new System("Utapau", 3, ResourceIcon.BlueCircle, ResourceIcon.BlueSquare),
      new System("Mustafar", 2, ResourceIcon.BlueTriangle, ResourceIcon.BlueCircle)
    ];
  }

  public systems: { [name: string]: System };

  public getFormattedBuildResults(faction: Faction): string {
    const buildResults = this.getBuildResults(faction);

    return _(buildResults)
      .chain()
      .groupBy(b => `${b.name}#${b.queuePosition}`)
      .sortBy(b => b[0].queuePosition)
      .sortBy(b => b[0].name)
      .map(b => `${b.length}x ${b[0].name} on ${b[0].queuePosition}`)
      .value()
      .join("\r\n");
  }

  public getBuildResults(faction: Faction): BuildResult[] {
    const systems = Object.keys(this.systems).map(k => this.systems[k]) as System[];

    var resources = _.flatten(_.map(systems, s => s.getResources(faction))) as Resource[];

    return _.map(resources, r => r.build(faction));
  }
}

