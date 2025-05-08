import { Test, TestingModule } from '@nestjs/testing';
import { RequestContextService } from './request-context.service';
import { AsyncLocalStorage } from 'async_hooks';

jest.mock('async_hooks', () => ({
  AsyncLocalStorage: jest.fn().mockImplementation(() => ({
    run: jest.fn((store, callback) => callback()),
    getStore: jest.fn(),
  })),
}));

describe('RequestContextService', () => {
  let service: RequestContextService;
  let alsMock: jest.Mocked<AsyncLocalStorage<Map<string, string>>>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestContextService],
    }).compile();

    service = module.get<RequestContextService>(RequestContextService);

    alsMock = (service as any).als;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run a callback with provided context', () => {
    const context = { requestId: '1234', userId: '5678' };
    const callback = jest.fn();

    service.run(callback, context);

    expect(alsMock.run).toHaveBeenCalledWith(expect.any(Map), callback);
    expect(Array.from(alsMock.run.mock.calls[0][0].entries())).toEqual(
      Object.entries(context),
    );
    expect(callback).toHaveBeenCalled();
  });

  it('should set a value in the current store', () => {
    const store = new Map<string, string>();
    alsMock.getStore.mockReturnValue(store);

    service.set('testKey', 'testValue');

    expect(store.get('testKey')).toBe('testValue');
  });

  it('should get a value from the current store', () => {
    const store = new Map<string, string>([['testKey', 'testValue']]);
    alsMock.getStore.mockReturnValue(store);

    const result = service.get('testKey');

    expect(result).toBe('testValue');
  });

  it('should return undefined if store is not available', () => {
    alsMock.getStore.mockReturnValue(undefined);

    const result = service.get('nonExistentKey');

    expect(result).toBeUndefined();
  });
});
