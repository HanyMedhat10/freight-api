import { User } from 'src/auth/entities/user.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShipmentStatus } from './enum/shipment-status.enum';
import { TrackingLog } from './tracking-log.entity';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  origin!: string;
  @Column()
  destination!: string;
  @Column({ type: 'float' })
  length!: number;
  @Column({ type: 'float' })
  width!: number;
  @Column({ type: 'float' })
  height!: number;
  @Column({ type: 'float' })
  weight!: number;
  @Column({ type: 'float', nullable: true })
  calculatedCbm?: number;
  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  status!: ShipmentStatus;

  @ManyToOne(() => User, (user) => user.shipments)
  @JoinColumn({ name: 'clientId' })
  client!: User;
  @ManyToOne(() => Contract, (contract) => contract.shipments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract!: Contract;
  @OneToMany(() => TrackingLog, (trackingLog) => trackingLog.shipment)
  trackingLogs!: TrackingLog[];
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
  @DeleteDateColumn()
  deletedAt!: Date;
}
