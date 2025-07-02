import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsumableEntity } from '../consumable/consumable.entity';

@Entity()
export class ConsumableGroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;

  @OneToMany(() => ConsumableEntity, (x) => x.group)
  consumables: ConsumableEntity[];
}