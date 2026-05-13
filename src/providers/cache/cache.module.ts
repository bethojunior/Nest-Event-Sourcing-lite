import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
        },
        ttl: 60,
        max: 100,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        // lazyConnect: true,
      }),
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}
