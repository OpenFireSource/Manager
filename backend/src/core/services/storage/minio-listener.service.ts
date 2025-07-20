import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpService } from '../amqp.service';
import {
  BucketEventDto,
  BucketEventRecordS3Object,
} from './dto/minio-listener/bucket-event.dto';
import { ImageService } from './image.service';

interface InjectedServices {
  imageService: ImageService;
}

@Injectable()
export class MinioListenerService implements OnApplicationBootstrap {
  static readonly imageRegex =
    /\/[0-9]+\/images\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  static readonly docRegex =
    /\/[0-9]+\/docs\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  constructor(
    private readonly queueService: AmqpService,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const queueName = this.configService.get<string>('AMQP.queueFileChange')!;
    await this.queueService.registerConsumer<BucketEventDto, InjectedServices>(
      queueName,
      {
        imageService: this.imageService,
      },
      this.onEvent,
    );
  }

  async onEvent(
    routingKey: string,
    message: BucketEventDto,
    services: InjectedServices,
  ): Promise<void> {
    if (message.Records.length != 1 && !message.Records[0].s3.object.key) {
      return;
    }

    switch (message.EventName) {
      case 's3:ObjectCreated:Post':
        await MinioListenerService.handleCreated(
          message.Records[0].s3.object,
          services,
        );
        break;
      // TODO handle update event
    }
  }

  private static async handleCreated(
    bucketObject: BucketEventRecordS3Object,
    services: InjectedServices,
  ): Promise<void> {
    const key = decodeURIComponent(bucketObject.key);
    const imageType = this.imageRegex.test(key);
    // const docType = this.docRegex.test(key);

    if (key.startsWith('devices/')) {
      if (imageType) {
        await services.imageService.processDevice(key);
      }
    }
  }
}
