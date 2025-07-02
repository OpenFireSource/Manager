import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity()
export class DeviceImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => DeviceEntity, (x) => x.images)
  device: DeviceEntity;
}
