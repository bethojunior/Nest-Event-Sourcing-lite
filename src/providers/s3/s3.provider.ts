import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class S3Provider {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadBuffer(buffer: Uint8Array, key: string, contentType: string): Promise<void> {
    const nodeBuffer = Buffer.from(buffer);

    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: nodeBuffer,
      ContentType: contentType,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<void> {
    const stream = Readable.from(file.buffer);

    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: stream,
      ContentType: file.mimetype,
      ContentLength: file.size,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
  }

  async deleteFile(key: string): Promise<void> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    await this.s3.send(new DeleteObjectCommand(deleteParams));
  }

  async deleteMultipleFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map(key => this.deleteFile(key));
    await Promise.all(deletePromises);
  }
}
