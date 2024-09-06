import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { PriceService } from './services/price.service';
import { PriceScheduler } from './services/price.scheduler';
import { PriceController } from './controllers/price.controller'; // Import PriceController

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Price],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Price]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PriceController], // Add PriceController here
  providers: [PriceService, PriceScheduler],
})
export class AppModule {}
