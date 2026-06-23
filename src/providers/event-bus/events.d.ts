export enum EventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

type EventMessage<T = any> = {
  eventId: string;
  type: string;
  payload: T;
};
