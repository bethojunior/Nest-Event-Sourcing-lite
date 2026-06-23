import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaReadProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaReadProvider.name);

  constructor() {
    super({
      datasources: { db: { url: process.env.DATABASE_READ_URL } },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Prisma (read) connected!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.error('❌ Prisma (read) disconnected!');
  }
}
