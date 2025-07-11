import { PartialType } from '@nestjs/mapped-types';
import { CreateEmploymentInfoDto } from './create-employment-info.dto';

export class UpdateEmploymentInfoDto extends PartialType(
  CreateEmploymentInfoDto,
) {}
