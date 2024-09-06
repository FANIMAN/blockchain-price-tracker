import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from '../entities/price.entity';
import { sendEmail } from '../utils/mailer';  // Import email utility

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  async fetchAndSavePrices() { 
    const chains = [
      { name: 'ethereum', address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' },  // Replace with correct ERC20 addresses
      { name: 'polygon', address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' }   // Example address, update as needed
    ];
    
    for (const chain of chains) {
      const price = await this.fetchPrice(chain.name, chain.address);
      if (price) {
        await this.priceRepository.save({ chain: chain.name, price });
      }
    }

    // After saving prices, check for significant price increase
    await this.checkPriceIncrease();
  }

  async fetchPrice(chainName: string, tokenAddress: string): Promise<number | null> {
    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/price`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.MORALIS_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImEwYWY2MDE3LWVhYjQtNGM0OS05NWU3LTNkZThmYmQ4MGY4NSIsIm9yZ0lkIjoiNDA3MTgwIiwidXNlcklkIjoiNDE4Mzk4IiwidHlwZUlkIjoiOTY5ZjU1ZTAtMjY1Ny00Mzc4LWFmNWEtOGQyN2Y4YWJmMGI3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjU1MzUxMDYsImV4cCI6NDg4MTI5NTEwNn0.8UCpyPN9AoZztKaeSadb2G7R51DcgyZxzuSTNj3DPDE',
        },
        params: {
          chain: 'eth',  // Use the appropriate chain name for your project, e.g., 'eth' for Ethereum, 'polygon' for Polygon
        //   chain: `${chainName}`,
          include: 'percent_change',  // Include 24hr percent change
        },
      });

      // Log response for debugging
      console.log('API response:', response.data);

      // Check if the price data exists in the response
      return response.data.usdPrice || null;  // Adjust based on the actual response structure
    } catch (error) {
      console.error(`Error fetching price for token ${tokenAddress}:`, error);
      return null;
    }
  }

  // Check if price increased by more than 3% compared to one hour ago
  async checkPriceIncrease() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const chains = ['ethereum', 'polygon'];

    for (const chain of chains) {
      const prices = await this.priceRepository.find({
        where: { chain, createdAt: Between(oneHourAgo, now) },
        order: { createdAt: 'ASC' },
      });

      if (prices.length > 0) {
        const oldPrice = prices[0].price; // Price from one hour ago
        const currentPrice = prices[prices.length - 1].price; // Latest price

        const percentageChange = ((currentPrice - oldPrice) / oldPrice) * 100;
        if (percentageChange > 3) {
          // If price increased by more than 3%, send an email alert
          await this.sendEmailAlert(chain, currentPrice, percentageChange);
        }
      }
    }
  }

  async sendEmailAlert(chain: string, currentPrice: number, percentageChange: number) {
    const subject = `Price Alert for ${chain}`;
    const message = `The price of ${chain} has increased by ${percentageChange.toFixed(2)}%. 
    Current price is ${currentPrice}.`;
    
    await sendEmail('hyperhire_assignment@hyperhire.in', subject, message);

  }

  async findAll(): Promise<Price[]> {
    return this.priceRepository.find();
  }

  async findByChain(chain: string): Promise<Price[]> {
    return this.priceRepository.find({ where: { chain } });
  }

  async create(chain: string, price: number): Promise<Price> {
    const newPrice = this.priceRepository.create({ chain, price });
    return this.priceRepository.save(newPrice);
  }

  async getHourlyPrices(): Promise<Price[]> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this.priceRepository.find({
      where: { createdAt: Between(oneDayAgo, now) },
      order: { createdAt: 'ASC' },
    });
  }

  async setPriceAlert(chain: string, price: number, email: string): Promise<void> {
  // const alert = new PriceAlert();
  // alert.chain = chain;
  // alert.price = price;
  // alert.email = email;

  // // Save the alert to the database
  // await priceAlertRepository.save(alert);
  }
}












