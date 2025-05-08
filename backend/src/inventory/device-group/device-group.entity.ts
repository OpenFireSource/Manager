import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceGroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;
}
