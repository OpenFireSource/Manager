import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTypeDbService } from './device-type-db.service';

describe('DeviceTypeDbService', () => {
  let service: DeviceTypeDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceTypeDbService],
    }).compile();

    service = module.get<DeviceTypeDbService>(DeviceTypeDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
