import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('advertiser/dashboard')
  @Roles(UserRole.ADVERTISER)
  async getAdvertiserDashboard(@Request() req) {
    return await this.analyticsService.getAdvertiserDashboard(req.user.userId);
  }

  @Get('advertiser/activity')
  @Roles(UserRole.ADVERTISER)
  async getAdvertiserActivity(@Request() req, @Query('limit') limit?: number) {
    return await this.analyticsService.getAdvertiserActivity(
      req.user.userId,
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('advertiser/top-campaigns')
  @Roles(UserRole.ADVERTISER)
  async getAdvertiserTopCampaigns(
    @Request() req,
    @Query('limit') limit?: number,
  ) {
    return await this.analyticsService.getAdvertiserTopCampaigns(
      req.user.userId,
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('advertiser/heatmap')
  @Roles(UserRole.ADVERTISER)
  async getHourlyHeatmap(@Request() req, @Query('days') days?: number) {
    return await this.analyticsService.getCampaignHourlyHeatmap(
      req.user.userId,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('publisher/dashboard')
  @Roles(UserRole.PUBLISHER)
  async getPublisherDashboard(@Request() req) {
    return await this.analyticsService.getPublisherDashboard(req.user.userId);
  }

  @Get('publisher/activity')
  @Roles(UserRole.PUBLISHER)
  async getPublisherActivity(@Request() req, @Query('limit') limit?: number) {
    return await this.analyticsService.getPublisherActivity(
      req.user.userId,
      limit ? parseInt(limit.toString()) : 8,
    );
  }

  @Get('publisher/top-placements')
  @Roles(UserRole.PUBLISHER)
  async getPublisherTopPlacements(
    @Request() req,
    @Query('limit') limit?: number,
  ) {
    return await this.analyticsService.getPublisherTopPlacements(
      req.user.userId,
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('publisher/earnings-chart')
  @Roles(UserRole.PUBLISHER)
  async getPublisherEarningsChart(
    @Request() req,
    @Query('days') days?: number,
  ) {
    return await this.analyticsService.getPublisherEarningsChart(
      req.user.userId,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('publisher/heatmap')
  @Roles(UserRole.PUBLISHER)
  async getPublisherHeatmap(@Request() req, @Query('days') days?: number) {
    return await this.analyticsService.getPublisherHourlyHeatmap(
      req.user.userId,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('campaign/:id')
  async getCampaignAnalytics(
    @Param('id') id: string,
    @Query('days') days?: number,
  ) {
    return await this.analyticsService.getCampaignAnalytics(
      id,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('advertiser/all-campaigns')
  @Roles(UserRole.ADVERTISER)
  async getAllCampaignsAnalytics(@Request() req, @Query('days') days?: number) {
    return await this.analyticsService.getAllCampaignsAnalytics(
      req.user.userId,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('site/:id')
  async getSiteAnalytics(
    @Param('id') id: string,
    @Query('days') days?: number,
  ) {
    return await this.analyticsService.getSiteAnalytics(
      id,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('top-campaigns')
  async getTopPerformingCampaigns(@Query('limit') limit?: number) {
    return await this.analyticsService.getTopPerformingCampaigns(
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('top-sites')
  async getTopEarningSites(@Query('limit') limit?: number) {
    return await this.analyticsService.getTopEarningSites(
      limit ? parseInt(limit.toString()) : 10,
    );
  }
}
