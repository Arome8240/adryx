import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../schemas/user.schema';
import { UserRole } from '../../../common/enums';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      clientID: configService.get<string>(
        'GITHUB_CLIENT_ID',
        'placeholder-github-client-id',
      ),
      clientSecret: configService.get<string>(
        'GITHUB_CLIENT_SECRET',
        'placeholder-github-client-secret',
      ),
      callbackURL: configService.get<string>(
        'GITHUB_CALLBACK_URL',
        'http://https://adryx-backend.onrender.com/api/v1/auth/github/callback',
      ),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: any) => void,
  ) {
    try {
      const { id, username, displayName, emails, photos } = profile;
      const email = emails?.[0]?.value ?? null;
      const avatar = photos?.[0]?.value ?? null;
      const name = displayName || username || `user_${id.slice(0, 8)}`;

      let user = await this.userModel.findOne({ githubId: id });

      if (!user && email) {
        user = await this.userModel.findOne({ email });
      }

      if (user) {
        if (!user.githubId) {
          user.githubId = id;
          if (!user.avatar && avatar) user.avatar = avatar;
          await user.save();
        }
      } else {
        user = await this.userModel.create({
          githubId: id,
          email: email ?? undefined,
          name,
          avatar: avatar ?? undefined,
          role: UserRole.PUBLISHER,
          emailVerified: !!email,
        });
        this.logger.log(
          `New user via GitHub OAuth: ${user.email ?? user.githubId}`,
        );
      }

      done(null, user);
    } catch (err) {
      this.logger.error('GitHub strategy validate error', err);
      done(err as Error);
    }
  }
}
