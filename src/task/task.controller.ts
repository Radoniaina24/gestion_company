import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  HttpStatus,
  Get,
  Req,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  @Roles('employee', 'manager')
  async create(
    @CurrentUserId() userId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const task = await this.taskService.create(userId, createTaskDto);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Tâche créée avec succès.', data: task });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la création de la tâche.',
      });
    }
  }

  @Get()
  @Roles('employee', 'manager', 'admin')
  async findAllForUser(
    @CurrentUserId() userId: string,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const tasks = await this.taskService.findAllForUser(userId, {
        page,
        limit,
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Liste des tâches récupérée.', data: tasks });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la récupération des tâches.',
      });
    }
  }

  @Get(':id')
  @Roles('employee', 'manager', 'admin')
  async findOneForUser(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const task = await this.taskService.findOneForUser(id, userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Tâche récupérée.', data: task });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message || 'Tâche introuvable ou accès refusé.',
      });
    }
  }

  @Patch(':id')
  @Roles('employee', 'manager', 'admin')
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const updatedTask = await this.taskService.update(
        id,
        userId,
        updateTaskDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Tâche mise à jour avec succès.', data: updatedTask });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la mise à jour de la tâche.',
      });
    }
  }

  @Delete(':id')
  @Roles('employee', 'manager', 'admin')
  async remove(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.taskService.remove(id, userId);
      return res.status(HttpStatus.OK).json({ message: result.message });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Erreur lors de la suppression de la tâche.',
      });
    }
  }
}
