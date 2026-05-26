import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity()
export class TrackingLog {
  // Define properties and relationships for the TrackingLog entity here
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  location!: string;
  @Column()
  description!: string;
  @ManyToOne(() => Shipment, (shipment) => shipment.trackingLogs, {
    onDelete: 'CASCADE',
  })
  shipment!: Shipment;
  @CreateDateColumn()
  timestamp!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
  @DeleteDateColumn()
  deletedAt!: Date;
}
