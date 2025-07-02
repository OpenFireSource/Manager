import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConsumableGroupEntity } from '../consumable-group/consumable-group.entity';
import { LocationEntity } from '../../base/location/location.entity';

@Entity()
export class ConsumableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;
  @Column({ type: 'int' })
  quantity: number;
  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({ nullable: true })
  groupId?: number;
  @ManyToOne(() => ConsumableGroupEntity, (x) => x.consumables, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  group?: ConsumableGroupEntity;

  @Column({ nullable: true })
  locationId?: number;
  @ManyToOne(() => LocationEntity, (x) => x.consumables, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  location?: LocationEntity;
}