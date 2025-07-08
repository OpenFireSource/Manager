import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationEntity } from '../../base/location/location.entity';
import { ConsumableEntity } from './consumable.entity';

@Entity()
export class ConsumableLocationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  quantity: number;
  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;
  @Column({ type: 'text', nullable: true })
  notice?: string;

  @Column()
  locationId: number;
  @Column()
  consumableId: number;

  @ManyToOne(() => LocationEntity, (x) => x.consumableLocations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  location: LocationEntity;

  @ManyToOne(() => ConsumableEntity, (x) => x.consumableLocations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  consumable: ConsumableEntity;
}
