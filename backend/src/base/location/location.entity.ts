import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

export enum LocationType {
  NONE = 0, // Keine Angabe
  LOCATION = 1, // Standort
  BUILDING = 2, // Gebäude
  BUILDING_PART = 3, // Gebäudeteil
  GARAGE = 4, // Garage
  VEHICLE = 100, // Fahrzeug
  CONTAINER = 101, // Container
  TRAILER = 102, // Anhänger
  DEVICE_COMPARTMENT = 103, // Gerätefach
  CREW_ROOM = 104, // Mannschaftsraum/Fahrerraum
  ROOM = 200, // Raum
  SHELF = 201, // Regal
  SHELF_COMPARTMENT = 202, // Regalfach
  DRAWER = 203, // Schublade
}

@Entity()
@Tree('closure-table')
export class LocationEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.NONE,
  })
  type: LocationType;

  // TODO optional Kooridnaten

  @TreeChildren()
  children: LocationEntity[];

  @Column({ type: 'int', nullable: true })
  parentId?: number;
  @TreeParent({ onDelete: 'SET NULL' })
  parent?: LocationEntity | null;
}
