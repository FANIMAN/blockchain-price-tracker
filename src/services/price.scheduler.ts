import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PriceService } from './price.service';

@Injectable()
export class PriceScheduler {
  constructor(private readonly priceService: PriceService) {}

  // Fetch prices every 5 minutes
  @Cron('*/5 * * * *')
  async handleCron() {
    try {
      console.log('Fetching and saving prices...');
      await this.priceService.fetchAndSavePrices();
      console.log('Prices fetched and saved successfully');
    } catch (error) {
      console.error('Error in fetching and saving prices:', error);
    }
  }
}
