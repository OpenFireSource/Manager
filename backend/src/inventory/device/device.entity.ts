import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceTypeEntity } from '../device-type/device-type.entity';
import { DeviceGroupEntity } from '../device-group/device-group.entity';
import { LocationEntity } from '../../base/location/location.entity';
import { DeviceImageEntity } from './device-image.entity';

export enum EquipmentState {
  ACTIVE = 0,
  DECOMMISSIONED = 1,
  RESERVE = 2,
  BROKEN = 3,
  IN_REPAIR = 4,
  LEND = 5,
  LOST = 6,
  OUT_OF_HOUSE = 7,
}

@Entity()
export class DeviceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  manufactor?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  dealer?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  serial?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  serialManufactor?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode1?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode2?: string;
  @Column({ type: 'date', nullable: true })
  producedDate?: Date;
  @Column({ type: 'date', nullable: true })
  activeDate?: Date;
  @Column({ type: 'date', nullable: true })
  decomissionDateManufacture?: Date;
  @Column({ type: 'date', nullable: true })
  decomissionDate?: Date;
  @Column({
    type: 'enum',
    enum: EquipmentState,
    default: EquipmentState.RESERVE,
  })
  state: EquipmentState;

  @Column({ nullable: true })
  typeId?: number;
  @ManyToOne(() => DeviceTypeEntity, (x) => x.devices, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  type?: DeviceTypeEntity;

  @Column({ nullable: true })
  groupId?: number;
  @ManyToOne(() => DeviceGroupEntity, (x) => x.devices, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  group?: DeviceGroupEntity;

  @Column({ nullable: true })
  locationId?: number;
  @ManyToOne(() => LocationEntity, (x) => x.devices, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  location?: LocationEntity;

  @OneToMany(() => DeviceImageEntity, (x) => x.device, { onDelete: 'CASCADE' })
  images: DeviceImageEntity[];
}
