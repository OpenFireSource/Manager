import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as sharp from 'sharp';
import { Sharp } from 'sharp';
import { DeviceService } from '../../../inventory/device/device.service';

@Injectable()
export class ImageService {
  static readonly sizes = [200, 480, 800, 1200, 1600, 2000, 4000];
  static readonly blurredSizes = [600];
  static readonly previewSuffix = '-webp-480';

  constructor(
    @Inject(forwardRef(() => MinioService))
    private readonly minioService: MinioService,
    @Inject(forwardRef(() => DeviceService))
    private readonly deivceService: DeviceService,
  ) {}

  public async processDevice(key: string) {
    try {
      const img = await this.loadImage(key);
      await this.convertImage(key, img);
      await this.generateSizes(key, img);
      await this.blurredImage(key, img);

      const parts = key.split('/');

      await this.deivceService.addImage(Number(parts[1]), parts[3]);
    } catch (error) {
      console.log(error);
      // TODO delete image
    }
  }

  private async convertImage(key: string, img: Sharp) {
    // in WebP umwandeln
    const buffer = await img.webp({ quality: 90 }).toBuffer();

    // speichern
    await this.minioService.putObject(key + '-webp', buffer, {
      'Content-Type': 'image/webp',
    });
  }

  private async generateSizes(key: string, img: Sharp) {
    for (const size of ImageService.sizes) {
      const buffer = await img.resize(size, null, { fit: 'inside' }).toBuffer();

      await this.minioService.putObject(key + '-webp-' + size, buffer, {
        'Content-Type': 'image/webp',
      });
    }
  }

  private async blurredImage(key: string, img: Sharp) {
    for (const size of ImageService.blurredSizes) {
      const buffer = await img
        .resize(size, null, { fit: 'inside' })
        .blur(40)
        .toBuffer();

      await this.minioService.putObject(
        key + '-webp-' + size + '-blur',
        buffer,
        {
          'Content-Type': 'image/webp',
        },
      );
    }
  }

  private async loadImage(key: string): Promise<Sharp> {
    const stream = await this.minioService.getObject(key);
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return sharp(Buffer.concat(chunks));
  }
}
