import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date; // Renamed for standard convention
}
