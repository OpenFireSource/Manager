import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import 'reflect-metadata';
import migrations from './migrations/migrations';

config({ path: '.env' });

const configService = new ConfigService();

export default new DataSource({
  type: 'mariadb',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE'),
  entities: [__dirname + '/src/**/*.entity.ts'],
  migrations: migrations,
});
