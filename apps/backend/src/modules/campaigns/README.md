# Campaigns Module - Solana Integration Guide

## Overview
This guide shows how to integrate the Solana payment services into the Campaigns module.

## Step 1: Import SolanaModule

Update `campaigns.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { SolanaModule } from '../solana/solana.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    SolanaModule, // Add this
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
```

## Step 2: Inject PaymentService

Update `campaigns.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { PaymentService } from '../solana/payment.service';
import { CampaignStatus } from '../../common/enums';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private readonly paymentService: PaymentService, // Add this
  ) {}

  // ... existing methods

  async fundCampaign(
    campaignId: string,
    advertiserWallet: string,
    amountSol: number,
  ) {
    // 1. Verify campaign exists and belongs to advertiser
    const campaign = await this.campaignModel.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // 2. Create escrow on-chain
    const { signature, escrowPda } = await this.paymentService.createCampaignEscrow(
      campaignId,
      advertiserWallet,
      amountSol,
    );

    // 3. Update campaign status
    await this.campaignModel.findByIdAndUpdate(campaignId, {
      status: CampaignStatus.ACTIVE,
      budget: amountSol,
      solanaTxHash: signature,
    });

    return {
      campaignId,
      signature,
      escrowPda,
      status: CampaignStatus.ACTIVE,
    };
  }

  async getCampaignBalance(campaignId: string) {
    const onChainBalance = await this.paymentService.syncCampaignBalance(campaignId);
    const campaign = await this.campaignModel.findById(campaignId);
    
    return {
      campaignId,
      budgetTotal: campaign.budget,
      spent: campaign.spent,
      remaining: campaign.budget - campaign.spent,
      onChainBalance,
    };
  }
}
```

## Step 3: Add Controller Endpoints

Update `campaigns.controller.ts`:

```typescript
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // ... existing endpoints

  @Post(':id/fund')
  async fundCampaign(
    @Param('id') id: string,
    @Body() body: { advertiserWallet: string; amountSol: number },
  ) {
    return await this.campaignsService.fundCampaign(
      id,
      body.advertiserWallet,
      body.amountSol,
    );
  }

  @Get(':id/balance')
  async getCampaignBalance(@Param('id') id: string) {
    return await this.campaignsService.getCampaignBalance(id);
  }
}
```

## Step 4: Frontend Integration

Example frontend code to fund a campaign:

```typescript
// Fund campaign
const fundCampaign = async (campaignId: string, amountSol: number) => {
  // 1. Get user's wallet
  const wallet = useWallet();
  
  // 2. Call backend to create escrow
  const response = await fetch(`/api/campaigns/${campaignId}/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      advertiserWallet: wallet.publicKey.toString(),
      amountSol,
    }),
  });
  
  const { signature, escrowPda } = await response.json();
  
  // 3. Show success message
  console.log('Campaign funded!', signature);
  console.log('Escrow PDA:', escrowPda);
};
```

## API Endpoints

### Fund Campaign
```
POST /campaigns/:id/fund
Body: {
  "advertiserWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amountSol": 10
}
Response: {
  "campaignId": "507f1f77bcf86cd799439011",
  "signature": "5j7s...",
  "escrowPda": "9xKXt...",
  "status": "active"
}
```

### Get Campaign Balance
```
GET /campaigns/:id/balance
Response: {
  "campaignId": "507f1f77bcf86cd799439011",
  "budgetTotal": 10,
  "spent": 2.5,
  "remaining": 7.5,
  "onChainBalance": 7.5
}
```

## Testing

```bash
# 1. Create a campaign (existing endpoint)
curl -X POST http://localhost:3001/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "format": "banner",
    "budget": 0,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'

# 2. Fund the campaign
curl -X POST http://localhost:3001/campaigns/507f1f77bcf86cd799439011/fund \
  -H "Content-Type: application/json" \
  -d '{
    "advertiserWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "amountSol": 10
  }'

# 3. Check balance
curl http://localhost:3001/campaigns/507f1f77bcf86cd799439011/balance
```

## Notes

- Campaign must be in DRAFT status before funding
- Once funded, campaign status changes to ACTIVE
- Balance is synced from on-chain escrow account
- Spent amount is tracked in MongoDB for performance
