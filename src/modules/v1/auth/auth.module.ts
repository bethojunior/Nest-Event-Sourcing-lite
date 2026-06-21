import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserCreatedEventConsumer } from './consumers/useCreated.event.consumer';
import { UserCreatedEvent } from './events/useCreated.event';
import { JwtStrategy } from './jwt.strategy';
import { type StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRATION_TIME || '7d') as StringValue,
      },
    }),
  ],
  controllers: [AuthController, UserCreatedEventConsumer],
  providers: [AuthService, UserCreatedEvent, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
