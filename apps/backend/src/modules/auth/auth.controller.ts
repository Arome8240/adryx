import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Email / password ──────────────────────────────────────────────────────

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ── Stellar wallet ────────────────────────────────────────────────────────

  @Post('wallet-login')
  @HttpCode(HttpStatus.OK)
  async walletLogin(@Body() walletLoginDto: WalletLoginDto) {
    return this.authService.walletLogin(walletLoginDto);
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport handles the redirect to Google — this handler never executes.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Res() res) {
    const result = await this.authService.generateTokensForOAuthUser(req.user);
    return this.redirectWithTokens(res, result);
  }

  // ── GitHub OAuth ──────────────────────────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Passport handles the redirect to GitHub — this handler never executes.
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Request() req, @Res() res) {
    const result = await this.authService.generateTokensForOAuthUser(req.user);
    return this.redirectWithTokens(res, result);
  }

  // ── Authenticated routes ──────────────────────────────────────────────────

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.validateUser(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  // ── Password reset ────────────────────────────────────────────────────────

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private redirectWithTokens(
    res: any,
    result: { accessToken: string; refreshToken: string },
  ) {
    const base = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = new URL('/auth/callback', base);
    url.searchParams.set('token', result.accessToken);
    url.searchParams.set('refreshToken', result.refreshToken);
    return res.redirect(url.toString());
  }
}
