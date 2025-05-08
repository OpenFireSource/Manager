import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { InventoryModule } from './inventory/inventory.module';
import { BaseModule } from './base/base.module';

@Module({
  imports: [CoreModule, InventoryModule, BaseModule],
})
export class AppModule {}
