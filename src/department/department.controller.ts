import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Department } from './schemas/department.schema';

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDepartmentDto) {
    try {
      const department = await this.departmentService.create(dto);
      return {
        message: 'Département créé avec succès',
        data: department,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la création du département',
        error: error.message,
      };
    }
  }

  @Get()
  @Roles('admin', 'manager')
  async getDepartments(@Query('search') search?: string): Promise<any> {
    try {
      const departments = await this.departmentService.findAll(search);
      return {
        message: 'Liste des départements récupérée avec succès',
        data: departments,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la récupération des départements',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async findOne(@Param('id') id: string) {
    try {
      const department = await this.departmentService.findOne(id);
      if (!department) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Département introuvable',
        };
      }
      return {
        message: 'Département récupéré avec succès',
        data: department,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la récupération du département',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    try {
      const updated = await this.departmentService.update(id, dto);
      return {
        message: 'Département mis à jour avec succès',
        data: updated,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la mise à jour du département',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      await this.departmentService.remove(id);
      return {
        message: 'Département supprimé avec succès',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la suppression du département',
        error: error.message,
      };
    }
  }
}
