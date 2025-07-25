import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Service } from './schemas/service.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ServiceGateway {
  @WebSocketServer()
  server: Server;

  emitCreated(service: Service) {
    this.server.emit('service.created', service);
  }

  emitUpdated(service: Service) {
    this.server.emit('service.updated', service);
  }

  emitDeleted(serviceId: string) {
    this.server.emit('service.deleted', { id: serviceId });
  }
}
