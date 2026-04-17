import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return await this.usersService.findById(req.user.userId);
  }

  @Put('me')
  async updateProfile(@Request() req, @Body() updates: any) {
    return await this.usersService.updateProfile(req.user.userId, updates);
  }

  @Put('me/wallet')
  async linkWallet(@Request() req, @Body() body: { walletAddress: string }) {
    return await this.usersService.linkWallet(
      req.user.userId,
      body.walletAddress,
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
