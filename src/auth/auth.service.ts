import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/enum/user.enum';
import { User } from './entities/user.entity';
@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    // Initialization logic here
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = (
      process.env.ADMIN_EMAIL || 'admin@gmail.com'
    ).toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword';
    const existingAdmin = await this.userRepository.findOneBy({
      email: adminEmail,
    });
    if (!existingAdmin) {
      const admin = this.userRepository.create({
        email: adminEmail.toLowerCase(),
        name: adminUser,
        password: await bcrypt.hash(adminPassword, 10),
        role: Role.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log(
        `Admin user created with email: ${adminEmail} and password: ${adminPassword}`,
      );
    } else {
      console.log(`Admin user already exists with email: ${adminEmail}`);
    }
  }
  create(createAuthDto: CreateUserDto) {
    return 'This action adds a new auth';
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
