import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventStatus } from '@prisma/client';
import { EventBusService } from 'src/providers/event-bus/event-bus.service';
import { EventMessage } from 'src/providers/event-bus/events';
import { PrismaWriteProvider } from 'src/providers/prisma/prisma-write.provider';
import { BlogCreatedEntity } from '../entities/blogCreated.entity';

@Controller()
export class BlogCreatedEventConsumer {
  constructor(
    private readonly prisma: PrismaWriteProvider,
    private eventBus: EventBusService,
  ) {}
  @EventPattern('blog.created')
  async handleBlogCreated(@Payload() props: EventMessage<BlogCreatedEntity>) {
    try {
      await this.eventBus.updateEvent(props.eventId, {
        status: EventStatus.PROCESSING,
      });

      const payload = props.payload;

      const post = await this.prisma.blog.create({
        data: {
          title: payload.title,
          content: payload.content,
        },
      });

      console.info('post created', post);
      await this.eventBus.updateEvent(props.eventId, {
        status: EventStatus.PROCESSED,
      });
    } catch (error) {
      await this.eventBus.updateEvent(props.eventId, {
        status: EventStatus.FAILED_PROCESSING,
        failedReason: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
