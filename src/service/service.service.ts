import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceGateway } from './service.gateway';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private model: Model<ServiceDocument>,
    private readonly gateway: ServiceGateway,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const created = await this.model.create(dto);
    this.gateway.emitCreated(created);
    return created;
  }

  async findAll(): Promise<Service[]> {
    return this.model.find().populate('departmentId').exec();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.model.findById(id).populate('departmentId');
    if (!service) throw new NotFoundException('Service non trouvé');
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .populate('departmentId');

    if (!updated) throw new NotFoundException('Service non trouvé');
    this.gateway.emitUpdated(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Service non trouvé');
    this.gateway.emitDeleted(id);
  }

  async findByDepartment(departmentId: string): Promise<Service[]> {
    return this.model
      .find({ departmentId })
      .populate('departmentId') // optionnel : pour inclure les infos du département
      .exec();
  }
}
