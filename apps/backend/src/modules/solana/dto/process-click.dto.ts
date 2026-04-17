import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ProcessClickDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  placementId: string;

  @IsString()
  @IsNotEmpty()
  publisherWallet: string;

  @IsString()
  @IsOptional()
  userIp?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
