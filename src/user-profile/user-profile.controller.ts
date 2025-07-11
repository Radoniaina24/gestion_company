import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userService: UserProfileService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @Post()
  async create(
    @Body() dto: CreateUserProfileDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const userId = req['userId'];
      const profil = await this.userService.create(userId, dto);
      res.status(HttpStatus.CREATED).json({
        message: 'Profil créé avec succès',
        profil,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const profils = await this.userService.findAll();
      res.status(HttpStatus.CREATED).json({
        message: 'succès',
        profils,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserProfileDto,
    @Res() res: Response,
  ) {
    try {
      const profil = await this.userService.update(id, dto);
      res.status(HttpStatus.OK).json({
        message: 'Profil mise à jour avec succès',
        profil,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
  @Roles('admin', 'manager')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.delete(id);
      res.status(HttpStatus.OK).json({
        message: 'Utilisateur supprimé avec succès',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  async getOwnProfile(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    try {
      const me = await this.userService.getByUserId(userId);
      res.status(HttpStatus.OK).json({
        message: 'succès',
        me,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @Patch('update/me')
  async updateOwnProfile(
    @Req() req: Request,
    @Body() dto: UpdateUserProfileDto,
    @Res() res: Response,
  ) {
    const userId = req['userId'];
    try {
      const profil = await this.userService.updateByUserId(userId, dto);
      res.status(HttpStatus.OK).json({
        message: 'Profil mise à jour avec succès',
        profil,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
