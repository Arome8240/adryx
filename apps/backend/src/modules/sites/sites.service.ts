import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from '../../schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async create(
    publisherId: string,
    createSiteDto: CreateSiteDto,
  ): Promise<Site> {
    // Generate verification code
    const verificationCode = `adryx-${randomBytes(16).toString('hex')}`;

    const createdSite = new this.siteModel({
      ...createSiteDto,
      publisherId,
      verificationCode,
    });

    return createdSite.save();
  }

  async findAll(publisherId: string): Promise<Site[]> {
    return this.siteModel
      .find({ publisherId })
      .populate('placements')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, publisherId: string): Promise<Site> {
    const site = await this.siteModel
      .findOne({ _id: id, publisherId })
      .populate('placements')
      .exec();

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async update(
    id: string,
    publisherId: string,
    updateSiteDto: UpdateSiteDto,
  ): Promise<Site> {
    const site = await this.siteModel
      .findOneAndUpdate({ _id: id, publisherId }, updateSiteDto, { new: true })
      .exec();

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async remove(id: string, publisherId: string): Promise<void> {
    const result = await this.siteModel
      .findOneAndDelete({ _id: id, publisherId })
      .exec();

    if (!result) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
  }

  async verifySite(id: string, publisherId: string): Promise<Site> {
    const site = await this.findOne(id, publisherId);

    if (site.verified) {
      throw new BadRequestException('Site is already verified');
    }

    // Attempt real meta tag verification
    const verified = await this.checkVerification(
      (site as any).url,
      (site as any).verificationCode,
    );

    if (!verified) {
      throw new BadRequestException(
        'Verification failed. Make sure the meta tag is present on your site.',
      );
    }

    const updatedSite = await this.siteModel
      .findByIdAndUpdate(
        id,
        { verified: true, verifiedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updatedSite)
      throw new NotFoundException(`Site with ID ${id} not found`);
    return updatedSite;
  }

  async checkVerification(
    url: string,
    verificationCode: string,
  ): Promise<boolean> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const html = await res.text();
      return (
        html.includes(`name="adryx:verification"`) &&
        html.includes(verificationCode)
      );
    } catch {
      return false;
    }
  }
}
