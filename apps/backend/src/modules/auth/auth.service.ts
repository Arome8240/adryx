import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if wallet is already linked
    if (registerDto.walletAddress) {
      const walletUser = await this.userModel.findOne({
        walletAddress: registerDto.walletAddress,
      });
      if (walletUser) {
        throw new ConflictException('Wallet already linked to another account');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.userModel.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.role,
      walletAddress: registerDto.walletAddress,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User registered: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async walletLogin(walletLoginDto: WalletLoginDto) {
    // Verify signature
    const isValid = await this.verifyWalletSignature(
      walletLoginDto.walletAddress,
      walletLoginDto.message,
      walletLoginDto.signature,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid wallet signature');
    }

    // Find or create user
    let user = await this.userModel.findOne({
      walletAddress: walletLoginDto.walletAddress,
    });

    if (!user) {
      // Create new user with wallet
      user = await this.userModel.create({
        walletAddress: walletLoginDto.walletAddress,
        name: `User ${walletLoginDto.walletAddress.slice(0, 8)}`,
        role: 'publisher', // Default role
      });
      this.logger.log(`New user created via wallet: ${user.walletAddress}`);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in via wallet: ${user.walletAddress}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async validateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.validateUser(userId);
    return this.generateTokens(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.userModel.findOne({
        email: dto.email,
        _id: { $ne: userId },
      });
      if (existing) throw new ConflictException('Email already in use');
    }
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true },
    );
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.password)
      throw new BadRequestException(
        'Account uses wallet login — no password set',
      );
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userModel.findByIdAndUpdate(user._id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    // In production, send an email here. For now, return the token in dev.
    this.logger.log(`Password reset token for ${dto.email}: ${token}`);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    this.logger.log(`Reset URL: ${resetUrl}`);

    return {
      message: 'If that email exists, a reset link has been sent.',
      // Only expose token in development
      ...(process.env.NODE_ENV !== 'production' && { token, resetUrl }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetToken: dto.token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    (user as any).resetToken = undefined;
    (user as any).resetTokenExpiry = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now log in.' };
  }

  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async verifyWalletSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.default.decode(signature);

      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes(),
      );
    } catch (error) {
      this.logger.error('Wallet signature verification failed', error);
      return false;
    }
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}
