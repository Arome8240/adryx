import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserRole } from '../../common/enums';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@adryx.xyz');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'Devarome123!');
    const name = this.config.get<string>('ADMIN_NAME', 'Admin');

    const existing = await this.userModel.findOne({ email }).lean();

    if (existing) {
      if (existing.role === UserRole.ADMIN) {
        this.logger.log(`Admin account already exists (${email}) — skipping seed.`);
      } else {
        // Upgrade existing user to admin
        await this.userModel.updateOne(
          { email },
          { $set: { role: UserRole.ADMIN, isActive: true } },
        );
        this.logger.log(`Upgraded existing user "${email}" to admin.`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
    });

    this.logger.log(`✓ Admin account created: ${email}`);
  }
}
