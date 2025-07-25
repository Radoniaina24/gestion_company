import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { Model } from 'mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentGateway } from './department.gateway';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
    private readonly gateway: DepartmentGateway,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const department = await this.departmentModel.create(dto);
    this.gateway.emitDepartmentCreated(department);
    return department;
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id);
    if (!department) {
      throw new NotFoundException(`Département avec l'id ${id} introuvable`);
    }
    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.departmentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!department)
      throw new NotFoundException(`Département avec l'id ${id} introuvable`);
    this.gateway.emitDepartmentUpdated(department);
    return department;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.departmentModel.findByIdAndDelete(id);
    if (!deleted)
      throw new NotFoundException(`Département avec l'id ${id} introuvable`);
    this.gateway.emitDepartmentDeleted(id);
  }
}
