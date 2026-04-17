import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SitesModule } from './modules/sites/sites.module';
import { PlacementsModule } from './modules/placements/placements.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SolanaModule } from './modules/solana/solana.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 
             `mongodb://${configService.get('DB_HOST', 'localhost')}:${configService.get('DB_PORT', '27017')}/${configService.get('DB_DATABASE', 'adryx')}`,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    AuthModule,
    UsersModule,
    SitesModule,
    PlacementsModule,
    CampaignsModule,
    InteractionsModule,
    AnalyticsModule,
    SolanaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
