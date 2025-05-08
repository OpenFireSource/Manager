import { Test, TestingModule } from '@nestjs/testing';
import { LocationDbService } from './location-db.service';

describe('LocationDbService', () => {
  let service: LocationDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationDbService],
    }).compile();

    service = module.get<LocationDbService>(LocationDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
