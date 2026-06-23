import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { type StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserCreatedEventConsumer } from './consumers/useCreated.event.consumer';
import { UserCreatedEntity } from './entities/useCreated.entity';
import { JwtStrategy } from './jwt.strategy';

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
  providers: [AuthService, UserCreatedEntity, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
