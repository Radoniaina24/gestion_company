import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Task } from './schemas/task.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TaskGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket initialisé');
  }

  // Méthodes pour émettre des événements
  taskCreated(task: Task) {
    this.server.emit('taskCreated', task);
  }

  taskUpdated(task: Task) {
    this.server.emit('taskUpdated', task);
  }

  taskDeleted(taskId: string) {
    this.server.emit('taskDeleted', taskId);
  }
}
