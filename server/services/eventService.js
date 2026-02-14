import { EventEmitter } from 'node:events';

export const eventBus = new EventEmitter();

export const publishEvent = (eventName, payload) => {
  eventBus.emit(eventName, { eventName, occurredAt: new Date().toISOString(), payload });
};

export const subscribeEvent = (eventName, handler) => {
  eventBus.on(eventName, handler);
};
