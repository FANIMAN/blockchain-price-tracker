import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('float')
  price: number;

  @Column()
  email: string;

  @Column({ default: false })
  notified: boolean; // Indicates if the alert has already been notified
}
