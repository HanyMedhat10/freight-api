import { Contract } from 'src/contract/entities/contract.entity';
import { Shipment } from 'src/shipment/entities/shipment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './enum/user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Simplified
  id!: string;

  @Column()
  name!: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  // select: false ensures the password isn't accidentally queried and leaked
  @Column({ select: false })
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role!: Role;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @OneToMany(() => Contract, (contract) => contract.client)
  contracts!: Contract[];
  @OneToMany(() => Shipment, (shipment) => shipment.client)
  shipments!: Shipment[];
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date; // Renamed for standard convention
}
