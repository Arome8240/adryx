import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../../entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
  ) {}

  async create(publisherId: string, createSiteDto: CreateSiteDto): Promise<Site> {
    // Generate verification code
    const verificationCode = `adryx-${randomBytes(16).toString('hex')}`;

    const site = this.sitesRepository.create({
      ...createSiteDto,
      publisherId,
      verificationCode,
    });

    return this.sitesRepository.save(site);
  }

  async findAll(publisherId: string): Promise<Site[]> {
    return this.sitesRepository.find({
      where: { publisherId },
      relations: ['placements'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, publisherId: string): Promise<Site> {
    const site = await this.sitesRepository.findOne({
      where: { id, publisherId },
      relations: ['placements'],
    });

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
    const site = await this.findOne(id, publisherId);

    Object.assign(site, updateSiteDto);

    return this.sitesRepository.save(site);
  }

  async remove(id: string, publisherId: string): Promise<void> {
    const site = await this.findOne(id, publisherId);
    await this.sitesRepository.remove(site);
  }

  async verifySite(id: string, publisherId: string): Promise<Site> {
    const site = await this.findOne(id, publisherId);

    if (site.verified) {
      throw new BadRequestException('Site is already verified');
    }

    // TODO: Implement actual verification logic
    // For meta tag: fetch the site and check for meta tag
    // For DNS: query DNS records

    site.verified = true;
    site.verifiedAt = new Date();

    return this.sitesRepository.save(site);
  }

  async checkVerification(url: string, verificationCode: string): Promise<boolean> {
    try {
      // TODO: Implement actual verification check
      // Fetch the URL and look for the meta tag or check DNS
      return true;
    } catch (error) {
      return false;
    }
  }
}
