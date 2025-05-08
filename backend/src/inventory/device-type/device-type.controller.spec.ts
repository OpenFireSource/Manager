import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTypeController } from './device-type.controller';

describe('DeviceTypeController', () => {
  let controller: DeviceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTypeController],
    }).compile();

    controller = module.get<DeviceTypeController>(DeviceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
