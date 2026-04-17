import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Placement, PlacementDocument } from '../../schemas/placement.schema';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class PlacementsService {
  constructor(
    @InjectModel(Placement.name)
    private placementModel: Model<PlacementDocument>,
  ) {}

  async create(
    publisherId: string,
    createPlacementDto: CreatePlacementDto,
  ): Promise<Placement> {
    const placement = await this.placementModel.create({
      ...createPlacementDto,
      publisherId,
    });

    return placement;
  }

  async findAll(publisherId?: string, siteId?: string): Promise<Placement[]> {
    const query: any = {};
    if (publisherId) query.publisherId = publisherId;
    if (siteId) query.siteId = siteId;

    return this.placementModel
      .find(query)
      .populate('site')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Placement> {
    const placement = await this.placementModel
      .findById(id)
      .populate('site')
      .exec();

    if (!placement) {
      throw new NotFoundException(`Placement with ID ${id} not found`);
    }

    return placement;
  }

  async update(
    id: string,
    publisherId: string,
    updatePlacementDto: UpdatePlacementDto,
  ): Promise<Placement> {
    const placement = await this.placementModel
      .findOneAndUpdate(
        { _id: id, publisherId },
        { $set: updatePlacementDto },
        { new: true },
      )
      .exec();

    if (!placement) {
      throw new NotFoundException(`Placement with ID ${id} not found`);
    }

    return placement;
  }

  async remove(id: string, publisherId: string): Promise<void> {
    const result = await this.placementModel
      .findOneAndDelete({ _id: id, publisherId })
      .exec();

    if (!result) {
      throw new NotFoundException(`Placement with ID ${id} not found`);
    }
  }

  async generateCode(id: string): Promise<string> {
    const placement = await this.findOne(id);

    // Generate integration code
    const code = `
<!-- Adryx Ad Placement -->
<div id="adryx-placement-${id}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${process.env.FRONTEND_URL || 'http://localhost:3000'}/sdk/adryx.js';
    script.async = true;
    script.onload = function() {
      Adryx.init({
        placementId: '${id}',
        format: '${placement.format}',
        publisherWallet: '${placement.publisherId}'
      });
    };
    document.head.appendChild(script);
  })();
</script>
    `.trim();

    return code;
  }

  async getPlacementStats(id: string) {
    const placement = await this.findOne(id);

    // Get interactions count
    const Interaction = this.placementModel.db.model('Interaction');
    const impressions = await Interaction.countDocuments({
      placementId: id,
      type: 'impression',
    });
    const clicks = await Interaction.countDocuments({
      placementId: id,
      type: 'click',
    });

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    // Calculate earnings
    const clickInteractions = await Interaction.find({
      placementId: id,
      type: 'click',
    });
    const earnings = clickInteractions.reduce(
      (sum, interaction) => sum + (interaction.reward || 0),
      0,
    );

    return {
      placementId: id,
      name: placement.name,
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      earnings: earnings.toFixed(4),
    };
  }
}
