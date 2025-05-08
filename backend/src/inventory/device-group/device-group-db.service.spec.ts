import { Test, TestingModule } from '@nestjs/testing';
import { DeviceGroupDbService } from './device-group-db.service';

describe('DeviceGroupDbService', () => {
  let service: DeviceGroupDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceGroupDbService],
    }).compile();

    service = module.get<DeviceGroupDbService>(DeviceGroupDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
