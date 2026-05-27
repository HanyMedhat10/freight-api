import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/enum/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique email address',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    example: 'StrongP@ss1',
    description: 'User password (min 8 chars, must include upper, lower, number, symbol)',
  })
  @MinLength(8)
  @IsStrongPassword()
  password!: string;

  @ApiProperty({ enum: Role, default: Role.CLIENT, description: 'User role' })
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}
