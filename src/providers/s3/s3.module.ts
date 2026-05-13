import { Global, Module } from '@nestjs/common';
import { S3Provider } from './s3.provider';

@Global()
@Module({
  providers: [S3Provider],
  exports: [S3Provider],
})
export class S3Module {}
