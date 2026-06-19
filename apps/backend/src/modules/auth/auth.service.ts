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
import * as nacl from 'tweetnacl';
import { StrKey } from '@stellar/stellar-base';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from './services/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) throw new ConflictException('Email already registered');

    if (registerDto.walletAddress) {
      const walletUser = await this.userModel.findOne({ walletAddress: registerDto.walletAddress });
      if (walletUser) throw new ConflictException('Wallet already linked to another account');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userModel.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.role,
      walletAddress: registerDto.walletAddress,
    });

    // Send welcome email (non-blocking)
    this.mailService.sendWelcome(user.email, user.name).catch(() => {});

    const tokens = await this.generateTokens(user);
    this.logger.log(`User registered: ${user.email}`);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    this.logger.log(`User logged in: ${user.email}`);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async walletLogin(walletLoginDto: WalletLoginDto) {
    const isValid = this.verifyStellarSignature(
      walletLoginDto.walletAddress,
      walletLoginDto.message,
      walletLoginDto.signature,
    );

    if (!isValid) throw new UnauthorizedException('Invalid wallet signature');

    let user = await this.userModel.findOne({ walletAddress: walletLoginDto.walletAddress });

    if (!user) {
      user = await this.userModel.create({
        walletAddress: walletLoginDto.walletAddress,
        name: `User ${walletLoginDto.walletAddress.slice(0, 8)}`,
        role: 'publisher',
      });
      this.logger.log(`New user created via Stellar wallet: ${user.walletAddress}`);
    }

    const tokens = await this.generateTokens(user);
    this.logger.log(`User logged in via wallet: ${user.walletAddress}`);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  /**
   * Called by the Google and GitHub OAuth strategies after they resolve the user.
   * Generates and returns tokens for the OAuth-authenticated user document.
   */
  async generateTokensForOAuthUser(user: UserDocument) {
    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async validateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.validateUser(userId);
    const tokens = await this.generateTokens(user);
    this.logger.log(`Tokens rotated for user: ${user._id}`);
    return tokens;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.userModel.findOne({ email: dto.email, _id: { $ne: userId } });
      if (existing) throw new ConflictException('Email already in use');
    }
    const user = await this.userModel.findByIdAndUpdate(userId, { $set: dto }, { new: true });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.password) {
      throw new BadRequestException('Account uses social/wallet login — no password set');
    }
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
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

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(user.email, resetUrl);

    this.logger.log(`Password reset requested for ${dto.email}`);

    return {
      message: 'If that email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' && { token, resetUrl }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetToken: dto.token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    (user as any).resetToken = undefined;
    (user as any).resetTokenExpiry = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now log in.' };
  }

  async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  sanitizeUser(user: UserDocument) {
    const obj = user.toObject();
    delete obj.password;
    delete obj.resetToken;
    delete obj.resetTokenExpiry;
    return obj;
  }

  /**
   * Verifies a Stellar wallet signature.
   *
   * Stellar uses Ed25519 keypairs. The G-address is a StrKey-encoded 32-byte
   * Ed25519 public key. Freighter (and other Stellar wallets) return signatures
   * as base64-encoded 64-byte Ed25519 signatures.
   */
  private verifyStellarSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ): boolean {
    try {
      if (!StrKey.isValidEd25519PublicKey(walletAddress)) return false;

      const publicKeyBytes = StrKey.decodeEd25519PublicKey(walletAddress);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = Buffer.from(signature, 'base64');

      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      this.logger.error('Stellar signature verification failed', error);
      return false;
    }
  }
}
