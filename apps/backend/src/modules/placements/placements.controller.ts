import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlacementsService } from './placements.service';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('placements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @Post()
  @Roles(UserRole.PUBLISHER)
  async create(@Request() req, @Body() createPlacementDto: CreatePlacementDto) {
    return await this.placementsService.create(
      req.user.userId,
      createPlacementDto,
    );
  }

  @Get()
  async findAll(@Request() req, @Query('siteId') siteId?: string) {
    const publisherId =
      req.user.role === UserRole.PUBLISHER ? req.user.userId : undefined;
    return await this.placementsService.findAll(publisherId, siteId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.placementsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.PUBLISHER)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updatePlacementDto: UpdatePlacementDto,
  ) {
    return await this.placementsService.update(
      id,
      req.user.userId,
      updatePlacementDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.PUBLISHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.placementsService.remove(id, req.user.userId);
  }

  @Get(':id/code')
  async getCode(@Param('id') id: string) {
    const code = await this.placementsService.generateCode(id);
    return { code };
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return await this.placementsService.getPlacementStats(id);
  }
}
