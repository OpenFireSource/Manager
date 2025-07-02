export interface BucketEventRecordS3Bucket {
  name: string;
  arn: string;
}

export interface BucketEventRecordS3Object {
  key: string;
  size: number;
  eTag: string;
  contentType: string;
  userMetadata: {
    'content-type': string;
  };
}

export interface BucketEventRecordS3 {
  s3SchemaVersion: string;
  configurationId: string;
  bucket: BucketEventRecordS3Bucket;
  object: BucketEventRecordS3Object;
}

export interface BucketEventRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: Date;
  eventName: string;
  s3: BucketEventRecordS3;
}

export interface BucketEventDto {
  EventName: string;
  Key: string;
  Records: BucketEventRecord[];
}
