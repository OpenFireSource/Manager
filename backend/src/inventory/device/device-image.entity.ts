import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity()
export class DeviceImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  deviceId: number;
  @ManyToOne(() => DeviceEntity, (x) => x.images)
  device: DeviceEntity;
}
