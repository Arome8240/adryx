import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class ClaimEarningsDto {
  @IsString()
  @IsNotEmpty()
  publisherWallet: string;

  @IsString()
  @IsOptional()
  @IsIn(['USDC', 'USDT'])
  token?: 'USDC' | 'USDT';

  // txSignature from the frontend-signed SPL transfer
  @IsString()
  @IsOptional()
  txSignature?: string;
}
