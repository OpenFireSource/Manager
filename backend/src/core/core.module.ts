import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations, validateConfig } from './configuration';
import { StartupService } from './services/startup.service';
import { MinioService } from './services/storage/minio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakService } from './services/keycloak.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { LocationEntity } from '../base/location/location.entity';
import { RequestContextService } from './services/request-context.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AppLoggerService } from './services/app-logger.service';
import * as process from 'node:process';
import { LoggerContextMiddleware } from './middleware/logger-context.middleware';
import { DeviceTypeEntity } from '../inventory/device-type/device-type.entity';
import { DeviceGroupEntity } from '../inventory/device-group/device-group.entity';
import { DeviceEntity } from '../inventory/device/device.entity';
import { AmqpService } from './services/amqp.service';
import { MinioListenerService } from './services/storage/minio-listener.service';
import { ImageService } from './services/storage/image.service';
import { DeviceImageEntity } from '../inventory/device/device-image.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: process.env['ENV'] === 'DEV' ? format.cli() : format.json(),
      transports: [new transports.Console()],
    }),
    PassportModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB.host'),
        port: configService.get<number>('DB.port'),
        username: configService.get('DB.username'),
        password: configService.get('DB.password'),
        database: configService.get('DB.database'),
        entities: [
          LocationEntity,
          DeviceTypeEntity,
          DeviceGroupEntity,
          DeviceEntity,
          DeviceImageEntity,
        ],
        extra: {
          connectionLimit: 10,
        },
        logging: ['warn', 'error'],
        synchronize: true,
        // migrations: migrations,
        // migrationsRun: true,
      }),
    }),
    InventoryModule,
  ],
  providers: [
    StartupService,
    MinioService,
    Logger,
    KeycloakService,
    JwtStrategy,
    UserService,
    GroupService,
    RequestContextService,
    AppLoggerService,
    LoggerContextMiddleware,
    AmqpService,
    MinioListenerService,
    ImageService,
  ],
  exports: [
    MinioService,
    KeycloakService,
    LoggerContextMiddleware,
    AmqpService,
  ],
  controllers: [UserController, GroupController],
})
@Global()
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Für alle Routen den LoggerContextMiddleware verwenden
    consumer.apply(LoggerContextMiddleware).forRoutes('{*wildcard}');
  }
}
