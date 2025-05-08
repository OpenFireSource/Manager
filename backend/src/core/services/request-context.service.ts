import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<Map<string, string>>();

  run(callback: () => void, context: Record<string, any>) {
    const store = new Map(Object.entries(context));
    this.als.run(store, callback);
  }

  set(key: string, value: any) {
    const store = this.als.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string): string | undefined {
    const store = this.als.getStore();
    return store?.get(key);
  }
}
