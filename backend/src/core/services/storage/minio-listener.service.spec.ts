import { Test, TestingModule } from '@nestjs/testing';
import { MinioListenerService } from './minio-listener.service';

describe('MinioListenerService', () => {
  let service: MinioListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinioListenerService],
    }).compile();

    service = module.get<MinioListenerService>(MinioListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
