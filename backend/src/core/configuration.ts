import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import {
  IsAlpha,
  IsBooleanString,
  IsDefined,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import * as process from 'node:process';

export enum ConfigKey {
  App = 'APP',
  Db = 'DB',
  Minio = 'MINIO',
  Keycloak = 'KEYCLOAK',
  Amqp = 'AMQP',
}

const AppConfig = registerAs(ConfigKey.App, () => ({
  organization: process.env.APP_ORGANISATION,
}));

const DbConfig = registerAs(ConfigKey.Db, () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
}));

const AmqpConfig = registerAs(ConfigKey.Amqp, () => ({
  host: process.env.AMQP_HOST,
  vhost: process.env.AMQP_VHOST,
  port: Number(process.env.AMQP_PORT),
  username: process.env.AMQP_USERNAME,
  password: process.env.AMQP_PASSWORD,
  queueFileChange: process.env.AMQP_QUEUE_FILE_CHANGE,
}));

const MinioConfig = registerAs(ConfigKey.Minio, () => ({
  host: process.env.MINIO_HOST,
  port: Number(process.env.MINIO_PORT),
  useSsl: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  uploadExpiry: Number(process.env.MINIO_UPLOAD_EXPIRY),
  downloadExpiry: Number(process.env.MINIO_DOWNLOAD_EXPIRY),
  bucketName: process.env.MINIO_BUCKET_NAME,
}));

const KeycloakConfig = registerAs(ConfigKey.Keycloak, () => ({
  url: process.env.KEYCLOAK_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  webFrontend: process.env.KEYCLOAK_WEB_FRONTEND,
  issuer: process.env.KEYCLOAK_ISSUER,
}));

export const configurations = [
  AppConfig,
  DbConfig,
  MinioConfig,
  KeycloakConfig,
  AmqpConfig,
];

class EnvironmentVariables {
  /* APP CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_ORGANISATION: string;

  /* DATA CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE_HOST: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  DATABASE_PORT: string;

  @IsDefined()
  @IsAlpha()
  @MinLength(1)
  DATABASE_USERNAME: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE_PASSWORD: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE: string;

  /* MINIO CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  MINIO_HOST: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  MINIO_PORT: string;

  @IsDefined()
  @IsBooleanString()
  @MinLength(1)
  MINIO_USE_SSL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  MINIO_ACCESS_KEY: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  MINIO_SECRET_KEY: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  MINIO_UPLOAD_EXPIRY: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  MINIO_DOWNLOAD_EXPIRY: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  MINIO_BUCKET_NAME: string;

  /* KEYCLOAK CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_URL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_REALM: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_CLIENT_ID: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_CLIENT_SECRET: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_WEB_FRONTEND: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  KEYCLOAK_ISSUER: string;

  /* AMQP CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  AMQP_HOST: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  AMQP_VHOST: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  AMQP_PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  AMQP_USERNAME: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  AMQP_PASSWORD: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  AMQP_QUEUE_FILE_CHANGE: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
  const logger = new Logger('configuration');

  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  for (const err of errors) {
    if (!err.constraints) continue;
    Object.values(err.constraints).map((str) => {
      logger.error(str);
    });
    logger.error('***** \n');
  }
  if (errors.length) {
    throw new Error('Please provide the valid ENVs mentioned above');
  }

  return finalConfig;
}
