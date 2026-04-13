import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SiteType } from '../../../common/enums';

export class CreateSiteDto {
  @ApiProperty({ example: 'My Tech Blog' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://mytechblog.com' })
  @IsUrl()
  url: string;

  @ApiProperty({ enum: SiteType, example: SiteType.WEBSITE })
  @IsEnum(SiteType)
  type: SiteType;

  @ApiProperty({ example: 'Technology', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}
