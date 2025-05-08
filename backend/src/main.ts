import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomClassSerializerInterceptor } from './shared/interceptor/custom-class-serializer.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StartupService } from './core/services/startup.service';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from './core/services/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalLogger = app.get(AppLoggerService);
  app.useLogger(globalLogger);

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(
    new CustomClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('OFS-Manager')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'oauth2',
      scheme: 'bearer',
      flows: {
        implicit: {
          scopes: {
            openid: 'openid',
            profile: 'profile',
          },
          authorizationUrl: `${configService.get<string>('KEYCLOAK.url')}/realms/${configService.get<string>('KEYCLOAK.realm')}/protocol/openid-connect/auth`,
          refreshUrl: `${configService.get<string>('KEYCLOAK.url')}/realms/${configService.get<string>('KEYCLOAK.realm')}/protocol/openid-connect/token`,
          tokenUrl: `${configService.get<string>('KEYCLOAK.url')}/realms/${configService.get<string>('KEYCLOAK.realm')}/protocol/openid-connect/token`,
        },
      },
    })
    .addSecurityRequirements({})
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory);

  // Umgebung initialisieren
  const startupService = app.get(StartupService);
  await startupService.init();

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
