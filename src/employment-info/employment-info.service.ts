import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmploymentInfo } from './schemas/employment-info.schema';

import { User } from '../user/schemas/user.schema';
import { CreateEmploymentInfoDto } from './dto/create-employment-info.dto';
import { UpdateEmploymentInfoDto } from './dto/update-employment-info.dto';

@Injectable()
export class EmploymentInfoService {
  constructor(
    @InjectModel(EmploymentInfo.name)
    private readonly employmentModel: Model<EmploymentInfo>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createForUser(userId: string, dto: CreateEmploymentInfoDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const existing = await this.employmentModel.findOne({ user: userId });
    if (existing)
      throw new BadRequestException('Les informations de poste existent déjà');

    return this.employmentModel.create({ ...dto, user: userId });
  }

  async getForUser(userId: string) {
    const info = await this.employmentModel
      .findOne({ user: userId })
      .populate('user');
    if (!info)
      throw new NotFoundException('Aucune information de poste trouvée');
    return info;
  }

  async updateForUser(userId: string, dto: UpdateEmploymentInfoDto) {
    const updated = await this.employmentModel.findOneAndUpdate(
      { user: userId },
      dto,
      { new: true },
    );
    if (!updated)
      throw new NotFoundException(
        'Impossible de mettre à jour les informations de poste',
      );
    return updated;
  }
}
