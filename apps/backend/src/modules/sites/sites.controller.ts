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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sites')
@Controller('sites')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site/app' })
  create(@Request() req, @Body() createSiteDto: CreateSiteDto) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.create(publisherId, createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites for the authenticated publisher' })
  findAll(@Request() req) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.findAll(publisherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific site by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.findOne(id, publisherId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a site' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSiteDto: UpdateSiteDto,
  ) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.update(id, publisherId, updateSiteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a site' })
  remove(@Param('id') id: string, @Request() req) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.remove(id, publisherId);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify site ownership' })
  verify(@Param('id') id: string, @Request() req) {
    // const publisherId = req.user.id;
    const publisherId = 'temp-publisher-id'; // TODO: Get from JWT
    return this.sitesService.verifySite(id, publisherId);
  }
}
