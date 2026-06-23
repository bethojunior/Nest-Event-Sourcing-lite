import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/v1/auth/auth.module';
import { EventBusModule } from './providers/event-bus/event-bus.module';
import { MailModule } from './providers/mail/mail.module';
import { DiscordNotificationProvider } from './providers/notification/discord.notification.provider';
import { NotificationEventHanlder } from './providers/notification/notification.event.handler';
import { PrismaModule } from './providers/prisma/prisma.module';
import { RedisModule } from './providers/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheConfigModule } from './providers/cache/cache.module';
import { S3Module } from './providers/s3/s3.module';
import { BlogModule } from './modules/v1/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    EventBusModule,
    RedisModule,
    MailModule,
    CacheConfigModule,
    S3Module,
    PrismaModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('AppModule', { timestamp: true }),
    },
    NotificationEventHanlder,
    DiscordNotificationProvider,
  ],
})
export class AppModule {}
