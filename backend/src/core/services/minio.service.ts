import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'image/heic',
  ];

  private client: Client;

  private readonly uploadExpiry: number;
  private readonly downloadExpiry: number;

  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const accessKey = this.configService.get<string>('MINIO.accessKey');
    const secretKey = this.configService.get<string>('MINIO.secretKey');
    const useSSL = this.configService.get<boolean>('MINIO.useSsl');
    const endPoint = this.configService.get<string>('MINIO.host')!;
    const port = this.configService.get<number>('MINIO.port');
    this.bucketName = this.configService.get<string>('MINIO.bucketName')!;

    this.uploadExpiry = this.configService.get<number>('MINIO.uploadExpiry')!;
    this.downloadExpiry = this.configService.get<number>(
      'MINIO.downloadExpiry',
    )!;

    this.client = new Client({
      endPoint,
      accessKey,
      secretKey,
      useSSL,
      port,
    });
  }

  async setupEnvironment() {
    this.logger.debug('Minio-Setup gestartet');

    // Bucket erstellen
    if (!(await this.client.bucketExists(this.bucketName))) {
      await this.client.makeBucket(this.bucketName);
      this.logger.debug('Minio Bucket erstellt');
    }

    this.logger.debug('Minio-Setup abgeschlossen');
  }
}
