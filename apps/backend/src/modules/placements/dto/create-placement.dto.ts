import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AdFormat } from '../../../common/enums';

export class CreatePlacementDto {
  @IsString()
  name: string;

  @IsString()
  siteId: string;

  @IsEnum(AdFormat)
  format: AdFormat;

  @IsString()
  @IsOptional()
  description?: string;
}
