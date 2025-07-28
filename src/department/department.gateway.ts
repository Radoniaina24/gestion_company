import { Department } from './schemas/department.schema';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DepartmentGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DepartmentGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket initialisé');
  }

  // Méthodes pour émettre des événements
  departmentCreated(department: Department) {
    this.server.emit('departmentCreated', department);
  }

  departmentUpdated(department: Department) {
    this.server.emit('departmentUpdated', department);
  }

  departmentDeleted(departmentId: string) {
    this.server.emit('departmentDeleted', departmentId);
  }
}
