import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserProfile } from './schemas/user-profile.schema';
import { Model } from 'mongoose';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfile>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async create(userId: string, dto: CreateUserProfileDto) {
    const user = await this.userModel.findById({ _id: userId });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    // Vérifie s’il a déjà un profil
    const existingProfile = await this.userProfileModel.findOne({
      user: userId,
    });
    if (existingProfile) {
      throw new BadRequestException(
        'Un profil existe déjà pour cet utilisateur',
      );
    }
    // Création du profil
    const createdProfile = new this.userProfileModel({ ...dto, user: userId });
    return createdProfile.save();
  }
  async findAll() {
    return this.userProfileModel
      .find({ isDeleted: false })
      .populate('user')
      .exec();
  }
  async update(id: string, dto: UpdateUserProfileDto) {
    const updated = await this.userProfileModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Mise à jour échouée');
    return updated;
  }
  async delete(id: string) {
    const result = await this.userProfileModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!result) throw new NotFoundException('Suppression échouée');
    return { message: 'Supprimé avec succès' };
  }
  async getByUserId(userId: string) {
    const profile = await this.userProfileModel
      .findOne({ user: userId })
      .populate('user');
    if (!profile) throw new NotFoundException('Profil non trouvé');
    return profile;
  }
  async updateByUserId(userId: string, dto: UpdateUserProfileDto) {
    const updated = await this.userProfileModel.findOneAndUpdate(
      { user: userId },
      dto,
      { new: true },
    );
    //console.log(updated);
    if (!updated)
      throw new NotFoundException('Impossible de mettre à jour le profil');
    return updated;
  }
}
