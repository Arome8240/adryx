import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles(UserRole.ADVERTISER)
  async create(@Request() req, @Body() createCampaignDto: CreateCampaignDto) {
    return await this.campaignsService.create(
      req.user.userId,
      createCampaignDto,
    );
  }

  @Get()
  async findAll(@Request() req) {
    // Advertisers see only their campaigns
    const advertiserId =
      req.user.role === UserRole.ADVERTISER ? req.user.userId : undefined;
    return await this.campaignsService.findAll(advertiserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.campaignsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADVERTISER)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return await this.campaignsService.update(
      id,
      req.user.userId,
      updateCampaignDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADVERTISER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.campaignsService.remove(id, req.user.userId);
  }

  @Post(':id/fund')
  @Roles(UserRole.ADVERTISER)
  async fundCampaign(
    @Param('id') id: string,
    @Request() req,
    @Body()
    body: { advertiserWallet: string; amountSol: number; txSignature?: string },
  ) {
    return await this.campaignsService.fundCampaign(
      id,
      req.user.userId,
      body.advertiserWallet,
      body.amountSol,
      body.txSignature,
    );
  }

  @Post(':id/pause')
  @Roles(UserRole.ADVERTISER)
  async pauseCampaign(@Param('id') id: string, @Request() req) {
    return await this.campaignsService.pauseCampaign(id, req.user.userId);
  }

  @Post(':id/resume')
  @Roles(UserRole.ADVERTISER)
  async resumeCampaign(@Param('id') id: string, @Request() req) {
    return await this.campaignsService.resumeCampaign(id, req.user.userId);
  }

  @Get(':id/balance')
  async getCampaignBalance(@Param('id') id: string) {
    return await this.campaignsService.getCampaignBalance(id);
  }

  @Get(':id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return await this.campaignsService.getCampaignStats(id);
  }
}
