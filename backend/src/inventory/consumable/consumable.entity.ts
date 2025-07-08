import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConsumableGroupEntity } from '../consumable-group/consumable-group.entity';
import { ConsumableLocationEntity } from './consumable-location.entity';

@Entity()
export class ConsumableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;

  @Column({ nullable: true })
  groupId?: number;
  @ManyToOne(() => ConsumableGroupEntity, (x) => x.consumables, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  group?: ConsumableGroupEntity;

  @OneToMany(() => ConsumableLocationEntity, (x) => x.consumable)
  consumableLocations?: ConsumableLocationEntity[];
}
