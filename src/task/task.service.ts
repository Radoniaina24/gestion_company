import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { User } from 'src/user/schemas/user.schema';
import { PaginationOptions } from 'src/interfaces/pagination-options.interface';
import { PaginationResult } from 'src/interfaces/pagination-result.interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return this.taskModel.create({ ...createTaskDto, user: userId });
  }

  async findAllForUser(
    userId: string,
    paginationOptions: PaginationOptions = { page: 1, limit: 10 },
  ): Promise<PaginationResult<Task>> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find({
          $or: [{ user: userId }, { responsible: userId }],
        })
        .populate('user', 'lastName firstName email')
        .populate('responsible', 'lastName firstName email')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel
        .countDocuments({
          $or: [{ user: userId }, { responsible: userId }],
        })
        .exec(),
    ]);

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findOneForUser(taskId: string, userId: string): Promise<Task> {
    // console.log(userId);
    const task = await this.taskModel
      .findOne({
        _id: taskId,
        $or: [{ user: userId }, { responsible: userId }],
      })
      .populate('user', 'lastName firstName email')
      .populate('responsible', 'lastName firstName email')
      .exec();

    if (!task) {
      throw new NotFoundException('Tâche non trouvée ou accès non autorisé.');
    }
    return task;
  }
  async update(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    console.log(userId);
    const task = await this.taskModel
      .findOneAndUpdate(
        {
          _id: taskId,
          user: userId,
        },
        { $set: updateTaskDto },
        { new: true, runValidators: true },
      )
      .populate('user', 'lastName firstName email')
      .populate('responsible', 'lastName firstName email')
      .exec();

    if (!task) {
      throw new ForbiddenException('Vous n’avez pas accès à cette tâche.');
    }

    return task;
  }
  async remove(taskId: string, userId: string): Promise<{ message: string }> {
    const deletedTask = await this.taskModel
      .findOneAndDelete({
        _id: taskId,
        user: userId,
      })
      .exec();

    if (!deletedTask) {
      throw new ForbiddenException(
        'Suppression interdite : tâche non trouvée ou accès refusé.',
      );
    }

    return { message: 'Tâche supprimée avec succès.' };
  }
}
