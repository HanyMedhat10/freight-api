import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  title!: string;
  @Column({ type: 'text' })
  terms!: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCost!: number;
  @Column({ default: true })
  isValid!: boolean;
  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId' })
  client!: User;
  //shipments
  // @OneToMany(() => Shipment, (shipment) => shipment.contract)
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  datedAt!: Date;
  @DeleteDateColumn()
  deletedAt!: Date;
}
