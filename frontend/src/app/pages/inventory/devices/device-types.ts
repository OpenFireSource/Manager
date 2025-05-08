export class DeviceTypes {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static readonly TYPES: Record<string, DeviceTypes> = {
    ACTIVE: new DeviceTypes(0, 'aktiv'),
    DECOMMISSIONED: new DeviceTypes(1, 'ausgemustert'),
    RESERVE: new DeviceTypes(2, 'reserve'),
    BROKEN: new DeviceTypes(3, 'defekt'),
    IN_REPAIR: new DeviceTypes(4, 'in Reperatur'),
    LEND: new DeviceTypes(5, 'verliehen'),
    LOST: new DeviceTypes(6, 'verloren'),
    OUT_OF_HOUSE: new DeviceTypes(7, 'außer Haus'),
  };

  static get all(): DeviceTypes[] {
    return Object.keys(DeviceTypes.TYPES).map(x => DeviceTypes.TYPES[x]);
  }

  static getById(id: number): DeviceTypes | undefined {
    return Object.values(DeviceTypes.TYPES).find(type => type.id === id);
  }
}
