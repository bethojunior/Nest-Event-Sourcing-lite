import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaWriteProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaWriteProvider.name);

  constructor() {
    super({
      datasources: { db: { url: process.env.DATABASE_URL } },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Prisma (write) connected!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.error('❌ Prisma (write) disconnected!');
  }
}
