import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {DeviceEntity} from "../device/device.entity";

@Entity()
export class DeviceGroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text', nullable: true })
  notice?: string;

  @OneToMany(() => DeviceEntity, (x) => x.group)
  devices: DeviceEntity[];
}
