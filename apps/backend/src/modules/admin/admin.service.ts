import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { Publisher, PublisherDocument } from '../../schemas/publisher.schema';
import { Impression, ImpressionDocument } from '../../schemas/impression.schema';
import { UserRole } from '../../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)       private userModel:       Model<UserDocument>,
    @InjectModel(Campaign.name)   private campaignModel:   Model<CampaignDocument>,
    @InjectModel(Publisher.name)  private publisherModel:  Model<PublisherDocument>,
    @InjectModel(Impression.name) private impressionModel: Model<ImpressionDocument>,
  ) {}

  async getPlatformStats() {
    const [
      totalUsers,
      advertiserCount,
      publisherCount,
      adminCount,
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: UserRole.ADVERTISER }),
      this.userModel.countDocuments({ role: UserRole.PUBLISHER }),
      this.userModel.countDocuments({ role: UserRole.ADMIN }),
      this.campaignModel.countDocuments(),
      this.campaignModel.countDocuments({ status: 'active' }),
      this.impressionModel.countDocuments(),
    ]);

    const spendAgg = await this.campaignModel.aggregate([
      { $group: { _id: null, totalSpent: { $sum: '$spent' }, totalBudget: { $sum: '$budgetUsdc' } } },
    ]);
    const totalSpent  = spendAgg[0]?.totalSpent  ?? 0;
    const totalBudget = spendAgg[0]?.totalBudget ?? 0;

    const recentUsers = await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role isActive createdAt')
      .lean();

    return {
      totalUsers,
      advertiserCount,
      publisherCount,
      adminCount,
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
      totalSpent,
      totalBudget,
      recentUsers,
    };
  }

  async getUsers({ page = 1, limit = 20, role, search, status }: {
    page?:   number;
    limit?:  number;
    role?:   string;
    search?: string;
    status?: string;
  }) {
    const filter: Record<string, any> = {};
    if (role)   filter.role = role;
    if (status === 'active')   filter.isActive = true;
    if (status === 'suspended') filter.isActive = false;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password -resetToken -resetTokenExpiry')
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async updateUserRole(userId: string, role: UserRole) {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true },
    ).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getCampaigns({ page = 1, limit = 20, status, search }: {
    page?:   number;
    limit?:  number;
    status?: string;
    search?: string;
  }) {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [campaigns, total] = await Promise.all([
      this.campaignModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('advertiserId', 'name email')
        .lean(),
      this.campaignModel.countDocuments(filter),
    ]);

    return {
      campaigns: campaigns.map((c: any) => ({
        _id:          c._id,
        name:         c.name,
        status:       c.status,
        format:       c.format,
        budget:       c.budgetUsdc ?? c.budget,
        spent:        c.spent,
        startDate:    c.startDate,
        endDate:      c.endDate,
        createdAt:    c.createdAt,
        advertiser:   c.advertiserId
          ? { id: (c.advertiserId as any)._id, name: (c.advertiserId as any).name, email: (c.advertiserId as any).email }
          : null,
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async updateCampaignStatus(campaignId: string, status: string) {
    const VALID = ['active', 'paused', 'draft', 'completed'];
    if (!VALID.includes(status)) throw new BadRequestException(`Invalid status: ${status}`);
    const campaign = await this.campaignModel.findByIdAndUpdate(
      campaignId,
      { status },
      { new: true },
    ).lean();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}
