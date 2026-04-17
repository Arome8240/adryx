import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SitesModule } from './modules/sites/sites.module';
import { PlacementsModule } from './modules/placements/placements.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

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
    AuthModule,
    UsersModule,
    SitesModule,
    PlacementsModule,
    CampaignsModule,
    InteractionsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
