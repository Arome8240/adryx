import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../schemas/user.schema';
import { UserRole } from '../../../common/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'placeholder-google-client-id'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret'),
      callbackURL: configService.get<string>(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:3001/api/v1/auth/google/callback',
      ),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const { id, name, emails, photos } = profile;
      const email = emails?.[0]?.value ?? null;
      const avatar = photos?.[0]?.value ?? null;
      const displayName =
        [name?.givenName, name?.familyName].filter(Boolean).join(' ') ||
        email?.split('@')[0] ||
        `user_${id.slice(0, 8)}`;

      // Prefer existing account linked to this Google ID
      let user = await this.userModel.findOne({ googleId: id });

      // Fall back to matching email
      if (!user && email) {
        user = await this.userModel.findOne({ email });
      }

      if (user) {
        if (!user.googleId) {
          user.googleId = id;
          if (!user.avatar && avatar) user.avatar = avatar;
          await user.save();
        }
      } else {
        user = await this.userModel.create({
          googleId: id,
          email: email ?? undefined,
          name: displayName,
          avatar: avatar ?? undefined,
          role: UserRole.PUBLISHER,
          emailVerified: !!email,
        });
        this.logger.log(`New user via Google OAuth: ${user.email ?? user.googleId}`);
      }

      done(null, user);
    } catch (err) {
      this.logger.error('Google strategy validate error', err);
      done(err as Error, undefined);
    }
  }
}
