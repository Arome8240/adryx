# Interactions Module - Solana Integration Guide

## Overview
This guide shows how to integrate the Solana payment services into the Interactions module for processing clicks and triggering payments.

## Step 1: Import SolanaModule

Update `interactions.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { Interaction, InteractionSchema } from '../../schemas/interaction.schema';
import { SolanaModule } from '../solana/solana.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    SolanaModule, // Add this
  ],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}
```

## Step 2: Inject PaymentService

Update `interactions.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from '../../schemas/interaction.schema';
import { PaymentService } from '../solana/payment.service';
import { InteractionType } from '../../common/enums';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Interaction.name) 
    private interactionModel: Model<InteractionDocument>,
    private readonly paymentService: PaymentService, // Add this
  ) {}

  // Record impression (free, off-chain only)
  async recordImpression(
    campaignId: string,
    placementId: string,
    userIp: string,
    userAgent: string,
  ) {
    const interaction = await this.interactionModel.create({
      type: InteractionType.IMPRESSION,
      campaignId,
      placementId,
      userIp,
      userAgent,
      reward: 0,
    });

    return {
      interactionId: interaction._id.toString(),
      type: 'impression',
    };
  }

  // Record click and trigger payment
  async recordClick(
    campaignId: string,
    placementId: string,
    publisherWallet: string,
    userIp: string,
    userAgent: string,
  ) {
    // Process click and trigger on-chain payment
    const { interactionId, txHash } = await this.paymentService.processClick(
      campaignId,
      placementId,
      publisherWallet,
      userIp,
      userAgent,
    );

    return {
      interactionId,
      type: 'click',
      txHash,
      paid: !!txHash,
    };
  }

  // Get interaction details
  async getInteraction(interactionId: string) {
    const interaction = await this.interactionModel
      .findById(interactionId)
      .populate('campaign')
      .populate('placement')
      .exec();

    if (!interaction) {
      throw new Error('Interaction not found');
    }

    return interaction;
  }

  // Get interactions for a campaign
  async getCampaignInteractions(campaignId: string, type?: InteractionType) {
    const query: any = { campaignId };
    if (type) {
      query.type = type;
    }

    return await this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  // Get interactions for a placement
  async getPlacementInteractions(placementId: string, type?: InteractionType) {
    const query: any = { placementId };
    if (type) {
      query.type = type;
    }

    return await this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }
}
```

## Step 3: Add Controller Endpoints

Update `interactions.controller.ts`:

```typescript
import { Controller, Post, Get, Body, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { InteractionsService } from './interactions.service';
import { InteractionType } from '../../common/enums';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('impression')
  async recordImpression(
    @Body() body: { campaignId: string; placementId: string },
    @Req() req: Request,
  ) {
    return await this.interactionsService.recordImpression(
      body.campaignId,
      body.placementId,
      req.ip || '',
      req.headers['user-agent'] || '',
    );
  }

  @Post('click')
  async recordClick(
    @Body() body: {
      campaignId: string;
      placementId: string;
      publisherWallet: string;
    },
    @Req() req: Request,
  ) {
    return await this.interactionsService.recordClick(
      body.campaignId,
      body.placementId,
      body.publisherWallet,
      req.ip || '',
      req.headers['user-agent'] || '',
    );
  }

  @Get(':id')
  async getInteraction(@Param('id') id: string) {
    return await this.interactionsService.getInteraction(id);
  }

  @Get('campaign/:campaignId')
  async getCampaignInteractions(
    @Param('campaignId') campaignId: string,
    @Query('type') type?: InteractionType,
  ) {
    return await this.interactionsService.getCampaignInteractions(
      campaignId,
      type,
    );
  }

  @Get('placement/:placementId')
  async getPlacementInteractions(
    @Param('placementId') placementId: string,
    @Query('type') type?: InteractionType,
  ) {
    return await this.interactionsService.getPlacementInteractions(
      placementId,
      type,
    );
  }
}
```

## Step 4: Frontend Integration

### Record Impression (Free)
```typescript
const recordImpression = async (campaignId: string, placementId: string) => {
  await fetch('/api/interactions/impression', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId, placementId }),
  });
};
```

### Record Click (Triggers Payment)
```typescript
const recordClick = async (
  campaignId: string,
  placementId: string,
  publisherWallet: string,
) => {
  const response = await fetch('/api/interactions/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      campaignId,
      placementId,
      publisherWallet,
    }),
  });

  const { interactionId, txHash, paid } = await response.json();
  
  if (paid) {
    console.log('Payment processed:', txHash);
  } else {
    console.log('Click recorded, payment pending');
  }
};
```

## API Endpoints

### Record Impression
```
POST /interactions/impression
Body: {
  "campaignId": "507f1f77bcf86cd799439011",
  "placementId": "507f1f77bcf86cd799439012"
}
Response: {
  "interactionId": "507f1f77bcf86cd799439013",
  "type": "impression"
}
```

### Record Click
```
POST /interactions/click
Body: {
  "campaignId": "507f1f77bcf86cd799439011",
  "placementId": "507f1f77bcf86cd799439012",
  "publisherWallet": "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV"
}
Response: {
  "interactionId": "507f1f77bcf86cd799439014",
  "type": "click",
  "txHash": "5j7s...",
  "paid": true
}
```

### Get Interaction
```
GET /interactions/:id
Response: {
  "_id": "507f1f77bcf86cd799439014",
  "type": "click",
  "campaignId": "507f1f77bcf86cd799439011",
  "placementId": "507f1f77bcf86cd799439012",
  "solanaTxHash": "5j7s...",
  "reward": 0.001,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Campaign Interactions
```
GET /interactions/campaign/:campaignId?type=click
Response: [
  {
    "_id": "507f1f77bcf86cd799439014",
    "type": "click",
    "reward": 0.001,
    "solanaTxHash": "5j7s...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Flow Diagram

```
User sees ad → Record Impression (free, off-chain)
     ↓
User clicks ad → Record Click
     ↓
Backend validates click
     ↓
Backend triggers Solana payment
     ↓
Smart contract transfers SOL
     ↓
Backend updates interaction with txHash
     ↓
Publisher earnings updated on-chain
```

## Testing

```bash
# 1. Record impression
curl -X POST http://localhost:3001/interactions/impression \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "507f1f77bcf86cd799439011",
    "placementId": "507f1f77bcf86cd799439012"
  }'

# 2. Record click (triggers payment)
curl -X POST http://localhost:3001/interactions/click \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "507f1f77bcf86cd799439011",
    "placementId": "507f1f77bcf86cd799439012",
    "publisherWallet": "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV"
  }'

# 3. Get interaction details
curl http://localhost:3001/interactions/507f1f77bcf86cd799439014

# 4. Get campaign clicks
curl http://localhost:3001/interactions/campaign/507f1f77bcf86cd799439011?type=click
```

## Error Handling

The service handles various error cases:

1. **Campaign not found** - Returns 404
2. **Campaign not active** - Returns 400
3. **Budget exhausted** - Returns 400
4. **Payment failure** - Click is recorded but payment is pending
5. **Network issues** - Click is recorded, payment can be retried

Failed payments can be retried using:
```bash
curl -X POST http://localhost:3001/solana/retry-failed-payments
```

## Notes

- Impressions are free and only stored in MongoDB
- Clicks trigger on-chain payments automatically
- If payment fails, click is still recorded for retry
- User IP and User-Agent are captured for fraud detection
- All payments are verifiable on Solana blockchain
