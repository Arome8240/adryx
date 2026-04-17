import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
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
    @Body()
    body: {
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
