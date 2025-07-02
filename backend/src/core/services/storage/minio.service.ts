import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ItemBucketMetadata } from 'minio';

@Injectable()
export class MinioService {
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
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

  public async setupEnvironment() {
    this.logger.debug('Minio-Setup gestartet');

    // Bucket erstellen
    if (!(await this.client.bucketExists(this.bucketName))) {
      await this.client.makeBucket(this.bucketName);
      this.logger.debug('Minio Bucket erstellt');
    }

    this.logger.debug('Minio-Setup abgeschlossen');
  }

  public async generatePresignedPutUrl(file: string): Promise<string> {
    return this.client.presignedPutObject(
      this.bucketName,
      file,
      this.uploadExpiry,
    );
  }

  public async generatePresignedPostUrl(
    file: string,
    contentType: string,
    fileSizeMb: number,
  ): Promise<{
    postURL: string;
    formData: {
      [key: string]: any;
    };
  }> {
    const policy = this.client.newPostPolicy();
    policy.setBucket(this.bucketName);
    policy.setKey(file);
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.uploadExpiry);
    policy.setExpires(expires);
    policy.setContentType(contentType);
    policy.setContentLengthRange(0, 1024 * 1024 * fileSizeMb); // in MB

    return this.client.presignedPostPolicy(policy);
  }

  public checkImageTypes(contentType: string) {
    return this.allowedImageTypes.some((x) => x === contentType);
  }

  public getObject(key: string) {
    return this.client.getObject(this.bucketName, key);
  }

  public putObject(key: string, webpBuffer: Buffer, metaData?: ItemBucketMetadata) {
    return this.client.putObject(
      this.bucketName,
      key,
      webpBuffer,
      webpBuffer.length,
      metaData,
    );
  }
}
