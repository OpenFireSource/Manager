import { Test, TestingModule } from '@nestjs/testing';
import { DeviceDbService } from './device-db.service';

describe('DeviceDbService', () => {
  let service: DeviceDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceDbService],
    }).compile();

    service = module.get<DeviceDbService>(DeviceDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
