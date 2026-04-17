import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByWallet(walletAddress: string): Promise<User | null> {
    return this.userModel.findOne({ walletAddress });
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async linkWallet(userId: string, walletAddress: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { walletAddress },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
