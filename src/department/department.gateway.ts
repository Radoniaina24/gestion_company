import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Department } from './schemas/department.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DepartmentGateway {
  @WebSocketServer()
  server: Server;

  emitDepartmentCreated(department: Department) {
    this.server.emit('department.created', department);
  }

  emitDepartmentUpdated(department: Department) {
    this.server.emit('department.updated', department);
  }

  emitDepartmentDeleted(departmentId: string) {
    this.server.emit('department.deleted', { id: departmentId });
  }
}
