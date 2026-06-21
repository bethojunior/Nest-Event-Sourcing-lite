import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventBusService } from 'src/providers/event-bus/event-bus.service';
import { UserCreatedEvent } from '../events/useCreated.event';
@Controller()
export class UserCreatedEventConsumer {
  constructor(private eventBus: EventBusService) {}
  @EventPattern('user.created')
  async handleUserCreated(@Payload() props: UserCreatedEvent) {
    console.info('User created event received:', props);
  }
}
