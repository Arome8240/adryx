import {
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdFormat } from '../../../common/enums';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AdFormat)
  format: AdFormat;

  @IsNumber()
  @Min(0)
  budget: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsUrl()
  targetUrl: string;

  @IsUrl()
  @IsOptional()
  creativeUrl?: string;
}
