/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as process from 'process';
import { PaginationDto } from 'src/core/utility/pagination.dto';
import { Repository } from 'typeorm';
import type { ChangePasswordDto } from './dto/change-password.dto';
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
      console.log(`Admin user created with email: ${adminEmail} `);
    } else {
      console.log(`Admin user already exists with email: ${adminEmail}`);
    }
  }
  async create(createUserDto: CreateUserDto, currentUser: User) {
    const email = createUserDto.email.toLowerCase();
    const userRecord = await this.userRepository.findOneBy({ email });
    if (userRecord) {
      throw new BadRequestException('Email is already in use');
    }
    const createdUser = this.userRepository.create({
      ...createUserDto,
      createdBy: currentUser,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const token = sign(
      { ...userWithoutPassword },
      process.env.JWT_SECRET || 'MySuperSecretKey123!',
      { expiresIn: '7d' },
    );
    return { ...userWithoutPassword, token };
  }
  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const existingUser = await this.userRepository.findOneBy({ id: user.id });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      existingUser.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }
    existingUser.password = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    return await this.userRepository.save(existingUser);
  }
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { contracts: true },
    });
  }

  async profile(user: User) {
    return await this.findOne(user.id);
  }
  async update(id: string, updateAuthDto: UpdateUserDto) {
    await this.userRepository.update(id, updateAuthDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.userRepository.softRemove(user);
    // but i have catch filter that catch error when user not found and return 404 not found, so i can use softDelete directly without check if user exist or not because if user not exist it will throw error and catch by filter and return 404 not found
    // return await this.userRepository.softDelete(id);
  }
}
