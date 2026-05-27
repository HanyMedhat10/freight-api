import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { PaginationDto } from 'src/core/utility/pagination.dto';
import { paginate } from 'src/core/utility/paginate';
import { Repository } from 'typeorm';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/enum/user.enum';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminUser = this.configService.get<string>('ADMIN_USERNAME');

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed',
      );
      return;
    }

    const normalizedEmail = adminEmail.toLowerCase();
    const existingAdmin = await this.userRepository.findOneBy({
      email: normalizedEmail,
    });

    if (!existingAdmin) {
      const admin = this.userRepository.create({
        email: normalizedEmail,
        name: adminUser || 'admin',
        password: await bcrypt.hash(adminPassword, 10),
        role: Role.ADMIN,
      });
      await this.userRepository.save(admin);
      this.logger.log(`Admin user created with email: ${normalizedEmail}`);
    } else {
      this.logger.log(
        `Admin user already exists with email: ${normalizedEmail}`,
      );
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
      email,
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
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: { id: true, password: true },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
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
    await this.userRepository.save(existingUser);
    return { message: 'Password changed successfully' };
  }

  async findAll(paginationDto: PaginationDto) {
    return paginate(this.userRepository, paginationDto, {
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { contracts: true },
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  async profile(user: User) {
    return await this.findOne(user.id);
  }

  async update(id: string, updateAuthDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);
    Object.assign(existingUser, updateAuthDto);
    return await this.userRepository.save(existingUser);
  }

  async remove(id: string) {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return result;
  }
}
