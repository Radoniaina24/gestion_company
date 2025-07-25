import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentId: string;
}
