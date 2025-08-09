import { Injectable } from '@nestjs/common';
import { InfoDto } from './dto/info.dto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfoService {
  constructor(private readonly configService: ConfigService) {}

  get(): InfoDto {
    return plainToInstance(InfoDto, {
      keycloakUrl: this.configService.get<string>('KEYCLOAK.issuer') || '',
    });
  }
}
