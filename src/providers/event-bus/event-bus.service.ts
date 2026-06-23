import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Event, EventStatus } from '@prisma/client';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { PrismaWriteProvider } from '../prisma/prisma-write.provider';

@Injectable()
export class EventBusService implements OnModuleInit {
  constructor(
    @Inject('EVENT_BUS')
    private readonly client: ClientProxy,
    private readonly prisma: PrismaWriteProvider,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('✅ EventBus conectado');
    } catch (err) {
      console.error('❌ Falha ao conectar EventBus', err);
    }
  }

  async emit(event: string, props: any): Promise<void> {
    const savedEvent = await this.prisma.event.create({
      data: {
        type: event,
        status: EventStatus.PENDING,
        payload: props,
      },
    });

    try {
      await lastValueFrom(
        this.client.emit(event, {
          eventId: savedEvent.id,
          type: event,
          payload: props,
        }),
      );
    } catch (error) {
      await this.updateEvent(savedEvent.id, {
        status: EventStatus.FAILED_PUBLISH,
        failedReason: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  async updateEvent(eventId: string, payload: Partial<Event>): Promise<void> {
    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: payload,
    });
  }

  async checkQueue(): Promise<boolean> {
    try {
      const result$ = this.client.send('health_check', { ping: true }).pipe(
        timeout(2000),
        catchError(() => of(false)),
      );
      const result = await lastValueFrom(result$);
      return result !== false;
    } catch (err) {
      console.error('❌ Fila não está respondendo', err);
      return false;
    }
  }
}
