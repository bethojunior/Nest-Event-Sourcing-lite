import { Global, Module } from '@nestjs/common';
import { PrismaReadProvider } from './prisma-read.provider';
import { PrismaWriteProvider } from './prisma-write.provider';

@Global()
@Module({
  providers: [PrismaWriteProvider, PrismaReadProvider],
  exports: [PrismaWriteProvider, PrismaReadProvider],
})
export class PrismaModule {}
