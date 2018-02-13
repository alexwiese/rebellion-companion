import * as _ from 'underscore';

export abstract class System {
  public probed: boolean;
  public hadImperialLoyalty: boolean;
  public hadImperialGroundTroops: boolean;

  constructor(public name: string) {
  }
}

export class PopulousSystem extends System {
  public status: SystemStatus;

  resources: Resource[];

  constructor(name: string, public buildQueuePosition: number, ...params: ResourceIcon[]) {
    super(name);
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

export class RemoteSystem extends System {

}

export class Coruscant extends PopulousSystem {
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
    super("Coruscant", 1, ResourceIcon.YellowTriangle);
    this.status = SystemStatus.ImperialLoyalty;
  }
}

export class RebelBase extends PopulousSystem {

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

export class Board {
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
      new PopulousSystem("Mon Calamari", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
      new PopulousSystem("Felucia", 1, ResourceIcon.YellowTriangle),
      new RemoteSystem("Yavin"),
      new RemoteSystem("Dathomir"),
      new RemoteSystem("Dantooine"),
      new PopulousSystem("Mygeeto", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
      new RemoteSystem("Ilum"),
      new PopulousSystem("Saleucami", 1, ResourceIcon.YellowCircle),
      new PopulousSystem("Kessel", 1, ResourceIcon.YellowTriangle),
      new PopulousSystem("Mandalore", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new PopulousSystem("Ord Mantell", 2, ResourceIcon.BlueCircle, ResourceIcon.YellowCircle),
      new PopulousSystem("Nal Hutta", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new PopulousSystem("Toydaria", 2, ResourceIcon.BlueCircle),
      new PopulousSystem("Kashyyk", 1, ResourceIcon.YellowTriangle, ResourceIcon.YellowTriangle),
      new PopulousSystem("Alderaan", 1, ResourceIcon.YellowTriangle),
      new PopulousSystem("Bothawui", 1, ResourceIcon.YellowCircle),
      new PopulousSystem("Malastare", 1, ResourceIcon.YellowTriangle),
      new PopulousSystem("Cato Neimoidia", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowCircle),
      new Coruscant(),
      new RemoteSystem("Tatooine"),
      new PopulousSystem("Rodia", 1, ResourceIcon.YellowTriangle),
      new PopulousSystem("Naboo", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
      new PopulousSystem("Sullust", 2, ResourceIcon.YellowTriangle, ResourceIcon.YellowSquare),
      new PopulousSystem("Corellia", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
      new PopulousSystem("Geonosis", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
      new RemoteSystem("Dagobah"),
      new PopulousSystem("Bespin", 1, ResourceIcon.YellowCircle),
      new RemoteSystem("Endor"),
      new PopulousSystem("Ryloth", 1, ResourceIcon.YellowTriangle),
      new PopulousSystem("Utapau", 3, ResourceIcon.BlueCircle, ResourceIcon.BlueSquare),
      new PopulousSystem("Mustafar", 2, ResourceIcon.BlueTriangle, ResourceIcon.BlueCircle),
      new RemoteSystem("Hoth"),
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
    const systems = Object.keys(this.systems).map(k => this.systems[k]).filter(s => s instanceof PopulousSystem) as PopulousSystem[];

    var resources = _.flatten(_.map(systems, s => s.getResources(faction))) as Resource[];

    return _.map(resources, r => r.build(faction));
  }
}

