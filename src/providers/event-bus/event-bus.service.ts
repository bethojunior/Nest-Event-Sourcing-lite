import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';

@Injectable()
export class EventBusService implements OnModuleInit {
  constructor(@Inject('EVENT_BUS') private client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('✅ EventBus conectado');
    } catch (err) {
      console.error('❌ Falha ao conectar EventBus', err);
    }
  }

  async emit(event: string, payload: any) {
    await this.client.connect();
    this.client.emit(event, payload);
  }

  async checkQueue(): Promise<boolean> {
    try {
      await this.client.connect();

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
