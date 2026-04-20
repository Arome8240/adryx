import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PUBLISHER)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Request() req, @Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(req.user.userId, createSiteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.sitesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.sitesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSiteDto: UpdateSiteDto,
  ) {
    return this.sitesService.update(id, req.user.userId, updateSiteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.sitesService.remove(id, req.user.userId);
  }

  @Post(':id/verify')
  verify(@Param('id') id: string, @Request() req) {
    return this.sitesService.verifySite(id, req.user.userId);
  }
}
