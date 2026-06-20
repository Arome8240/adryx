# Campaigns Module — Stellar Integration Guide

## Overview

This guide shows how to integrate Stellar / Soroban payment services into the Campaigns module.

## Step 1: Import StellarModule

Update `campaigns.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    StellarModule,
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
import { PaymentService } from '../stellar/payment.service';
import { CampaignStatus } from '../../common/enums';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async fundCampaign(
    campaignId: string,
    advertiserWallet: string,
    amountXlm: number,
  ) {
    const campaign = await this.campaignModel.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Create escrow via Soroban contract
    const { txHash, escrowId } = await this.paymentService.createCampaignEscrow(
      campaignId,
      advertiserWallet,
      amountXlm,
    );

    await this.campaignModel.findByIdAndUpdate(campaignId, {
      status: CampaignStatus.ACTIVE,
      budget: amountXlm,
      stellarTxHash: txHash,
    });

    return { campaignId, txHash, escrowId, status: CampaignStatus.ACTIVE };
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

  @Post(':id/fund')
  async fundCampaign(
    @Param('id') id: string,
    @Body() body: { advertiserWallet: string; amountXlm: number },
  ) {
    return this.campaignsService.fundCampaign(id, body.advertiserWallet, body.amountXlm);
  }

  @Get(':id/balance')
  async getCampaignBalance(@Param('id') id: string) {
    return this.campaignsService.getCampaignBalance(id);
  }
}
```

## Step 4: Frontend Integration

```typescript
const fundCampaign = async (campaignId: string, amountXlm: number) => {
  const { address } = useStellarWallet();

  const response = await fetch(`/api/campaigns/${campaignId}/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ advertiserWallet: address, amountXlm }),
  });

  const { txHash, escrowId } = await response.json();
  console.log('Campaign funded!', txHash);
  console.log('Escrow ID:', escrowId);
};
```

## API Endpoints

### Fund Campaign

```
POST /campaigns/:id/fund
Body: {
  "advertiserWallet": "GABC...XYZ",
  "amountXlm": 100
}
Response: {
  "campaignId": "507f1f77bcf86cd799439011",
  "txHash": "abc123...",
  "escrowId": "def456...",
  "status": "active"
}
```

### Get Campaign Balance

```
GET /campaigns/:id/balance
Response: {
  "campaignId": "507f1f77bcf86cd799439011",
  "budgetTotal": 100,
  "spent": 25,
  "remaining": 75,
  "onChainBalance": 75
}
```

## Testing

```bash
# Create a campaign
curl -X POST http://localhost:3001/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","format":"banner","budget":0,"startDate":"2024-01-01","endDate":"2024-12-31"}'

# Fund the campaign
curl -X POST http://localhost:3001/campaigns/507f1f77bcf86cd799439011/fund \
  -H "Content-Type: application/json" \
  -d '{"advertiserWallet":"GABC...XYZ","amountXlm":100}'

# Check balance
curl http://localhost:3001/campaigns/507f1f77bcf86cd799439011/balance
```

## Notes

- Campaign must be in DRAFT status before funding
- Once funded, campaign status changes to ACTIVE
- Balance is synced from the on-chain Soroban escrow contract via Horizon API
- Spent amount is tracked in MongoDB for performance
