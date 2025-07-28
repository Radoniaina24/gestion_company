import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      dto.name = dto.name.toLowerCase().trim();
      const department = await this.departmentModel.create(dto);
      this.gateway.departmentCreated(department);
      return department;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.name) {
        throw new ConflictException(
          'Un département avec ce nom existe déjà (insensible à la casse).',
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création du département.',
      );
    }
  }

  async findAll(search?: string): Promise<Department[]> {
    const filter: Record<string, any> = {};

    if (search) {
      filter.name = { $regex: new RegExp(search, 'i') };
    }
    return this.departmentModel.find(filter).sort({ name: 1 }).exec();
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
    this.gateway.departmentUpdated(department);
    return department;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.departmentModel.findByIdAndDelete(id);
    if (!deleted)
      throw new NotFoundException(`Département avec l'id ${id} introuvable`);
    this.gateway.departmentDeleted(id);
  }
}
