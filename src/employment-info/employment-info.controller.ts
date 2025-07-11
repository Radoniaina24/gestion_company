import { Response } from 'express';
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { EmploymentInfoService } from './employment-info.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateEmploymentInfoDto } from './dto/create-employment-info.dto';
import { UpdateEmploymentInfoDto } from './dto/update-employment-info.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('employment-info')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmploymentInfoController {
  constructor(private readonly employmentService: EmploymentInfoService) {}

  @Post('me')
  @Roles('employee')
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateEmploymentInfoDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.employmentService.createForUser(userId, dto);
      res.status(HttpStatus.CREATED).json({
        message: 'Info créé avec succès',
        employee,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get('me')
  @Roles('employee')
  async get(@CurrentUserId() userId: string, @Res() res: Response) {
    try {
      const employee = await this.employmentService.getForUser(userId);
      res.status(HttpStatus.CREATED).json({
        message: 'succès',
        employee,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Patch('me')
  @Roles('employee')
  async update(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateEmploymentInfoDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.employmentService.updateForUser(userId, dto);
      res.status(HttpStatus.CREATED).json({
        message: 'Mise à jour avec succès',
        employee,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
