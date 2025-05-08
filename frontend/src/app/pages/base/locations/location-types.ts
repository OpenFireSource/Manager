export class LocationTypes {
  id: number;
  name: string;
  icon?: string;

  constructor(id: number, name: string, icon?: string) {
    this.id = id;
    this.name = name;
    this.icon = icon;
  }

  static readonly TYPES: Record<string, LocationTypes> = {
    NONE: new LocationTypes(0, 'Keine Angabe', 'question'),
    LOCATION: new LocationTypes(1, 'Standort', 'cloud'),
    BUILDING: new LocationTypes(2, 'Gebäude', 'home'),
    BUILDING_PART: new LocationTypes(3, 'Gebäudeteil'),
    GARAGE: new LocationTypes(4, 'Garage'),
    VEHICLE: new LocationTypes(100, 'Fahrzeug', 'car'),
    CONTAINER: new LocationTypes(101, 'Container'),
    TRAILER: new LocationTypes(102, 'Anhänger'),
    DEVICE_COMPARTMENT: new LocationTypes(103, 'Gerätefach'),
    CREW_ROOM: new LocationTypes(104, 'Mannschaftsraum/Fahrerraum'),
    ROOM: new LocationTypes(200, 'Raum'),
    SHELF: new LocationTypes(201, 'Regal'),
    SHELF_COMPARTMENT: new LocationTypes(202, 'Regalfach'),
    DRAWER: new LocationTypes(203, 'Schublade'),
  };

  static get all(): LocationTypes[] {
    return Object.keys(LocationTypes.TYPES).map(x => LocationTypes.TYPES[x]);
  }

  static getById(id: number): LocationTypes | undefined {
    return Object.values(LocationTypes.TYPES).find(type => type.id === id);
  }
}
