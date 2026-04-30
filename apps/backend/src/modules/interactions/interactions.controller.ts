import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { InteractionsService } from './interactions.service';
import { InteractionType } from '../../common/enums';

@Controller('interactions')
@UseGuards(ThrottlerGuard)
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  /** Public — called by the ad SDK on publisher sites */
  @Post('impression')
  @Throttle({ default: { ttl: 60000, limit: 120 } }) // 2 impressions/sec per IP
  async recordImpression(
    @Body() body: { campaignId: string; placementId: string },
    @Req() req: any,
  ) {
    const userIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';

    return this.interactionsService.recordImpression(
      body.campaignId,
      body.placementId,
      userIp,
      userAgent,
    );
  }

  /** Public — called by the ad SDK when user clicks an ad */
  @Post('click')
  @Throttle({ default: { ttl: 60000, limit: 30 } }) // 30 clicks/min per IP
  async recordClick(
    @Body()
    body: { campaignId: string; placementId: string; publisherWallet: string },
    @Req() req: any,
  ) {
    const userIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';

    return this.interactionsService.recordClick(
      body.campaignId,
      body.placementId,
      body.publisherWallet,
      userIp,
      userAgent,
    );
  }

  @Get(':id')
  async getInteraction(@Param('id') id: string) {
    return this.interactionsService.getInteraction(id);
  }

  @Get('campaign/:campaignId')
  async getCampaignInteractions(
    @Param('campaignId') campaignId: string,
    @Query('type') type?: InteractionType,
  ) {
    return this.interactionsService.getCampaignInteractions(campaignId, type);
  }

  @Get('placement/:placementId')
  async getPlacementInteractions(
    @Param('placementId') placementId: string,
    @Query('type') type?: InteractionType,
  ) {
    return this.interactionsService.getPlacementInteractions(placementId, type);
  }

  /** Publisher earnings — requires auth */
  @Get('earnings/publisher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER)
  async getPublisherEarnings(@Request() req: any) {
    return this.interactionsService.getPublisherEarnings(req.user.userId);
  }

  @Get('earnings/placement/:placementId')
  async getPlacementEarnings(@Param('placementId') placementId: string) {
    return this.interactionsService.getPlacementEarnings(placementId);
  }
}
