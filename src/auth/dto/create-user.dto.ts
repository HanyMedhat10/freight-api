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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;
  /* 
  @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
  
  */
  @ApiProperty()
  @MinLength(8)
  @IsStrongPassword()
  password!: string;
  @ApiProperty({ enum: Role, default: Role.CLIENT })
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}
