import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PriceService } from '../services/price.service';
import { Price } from '../entities/price.entity';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async findAll(): Promise<Price[]> {
    return this.priceService.findAll();
  }

  @Get(':chain')
  async findByChain(@Param('chain') chain: string): Promise<Price[]> {
    return this.priceService.findByChain(chain);
  }

  @Post()
  async create(@Body() createPriceDto: { chain: string; price: number }): Promise<Price> {
    return this.priceService.create(createPriceDto.chain, createPriceDto.price);
  }
  @Get('hourly')
  async getHourlyPrices(): Promise<Price[]> {
    return this.priceService.getHourlyPrices();
  }

  @Post('alert')
  async setPriceAlert(
    @Body() alertDto: { chain: string; price: number; email: string },
  ): Promise<void> {
    await this.priceService.setPriceAlert(alertDto.chain, alertDto.price, alertDto.email);
  }

// Manually fetch prices for testing
@Get('fetch/manual')
async fetchAndSavePricesManually() {
  await this.priceService.fetchAndSavePrices();
  return { message: 'Prices fetched and saved successfully' };
}
}
