import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from '../device/device.entity';

@Entity()
export class DeviceTypeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;
  @Column({ type: 'real', nullable: true })
  pricePerUnit?: number;
  @Column({ type: 'varchar', length: 100, nullable: true })
  manufactor?: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  dealer?: string;
  @Column({ type: 'boolean', default: false })
  visualInspectionAfterUsage: boolean;

  @OneToMany(() => DeviceEntity, (x) => x.type)
  devices: DeviceEntity[];
}
