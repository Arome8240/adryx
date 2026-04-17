import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import { InteractionsService } from './interactions.service';
import { InteractionType } from '../../common/enums';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('impression')
  async recordImpression(
    @Body() body: { campaignId: string; placementId: string; userIp?: string; userAgent?: string },
  ) {
    return await this.interactionsService.recordImpression(
      body.campaignId,
      body.placementId,
      body.userIp || '',
      body.userAgent || '',
    );
  }

  @Post('click')
  async recordClick(
    @Body()
    body: {
      campaignId: string;
      placementId: string;
      publisherWallet: string;
      userIp?: string;
      userAgent?: string;
    },
  ) {
    return await this.interactionsService.recordClick(
      body.campaignId,
      body.placementId,
      body.publisherWallet,
      body.userIp || '',
      body.userAgent || '',
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
