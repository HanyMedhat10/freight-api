import {
  BadRequestException,
  Injectable,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { LoginDto } from './dto/login.dto';
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
  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new BadRequestException('Email is already in use');
    }
    const createdUser = this.userRepository.create({
      name: createUserDto.name,
      email,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    return await this.userRepository.save(createdUser);
  }
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email.toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
    /* delete user.password; // Remove password before returning user data
    const token = sign({ ...user }, process.env.JWT_SECRET || 'secret');
    return { ...user, token }; */
  }
  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateAuthDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    Object.assign(user, updateAuthDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return await this.userRepository.softRemove(user);
  }
}
