import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreatePlacementDto } from './create-placement.dto';

export class UpdatePlacementDto extends PartialType(CreatePlacementDto) {
  @IsString()
  @IsOptional()
  status?: string;
}
