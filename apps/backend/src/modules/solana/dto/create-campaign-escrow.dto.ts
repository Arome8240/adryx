import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateCampaignEscrowDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  advertiserWallet: string;

  @IsNumber()
  @IsPositive()
  amountSol: number;
}
