import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from './minio.service';
import { KeycloakService } from './keycloak.service';

/**
 * Der StartupService wird beim Starten der Anwendung ausgeführt und initialisiert die Umgebung.
 */
@Injectable()
export class StartupService {
  constructor(
    private readonly minioService: MinioService,
    private readonly keycloakService: KeycloakService,
    private readonly logger: Logger,
  ) {}

  /**
   * Initialisiert die Umgebung.
   */
  async init() {
    this.logger.debug('Startup-Setup gestartet');
    await this.minioService.setupEnvironment();
    await this.keycloakService.setupEnvironment();
    this.logger.debug('Startup-Setup abgeschlossen');
  }
}
