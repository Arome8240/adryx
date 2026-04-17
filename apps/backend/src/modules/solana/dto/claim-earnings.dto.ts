import { IsString, IsNotEmpty } from 'class-validator';

export class ClaimEarningsDto {
  @IsString()
  @IsNotEmpty()
  publisherWallet: string;
}
