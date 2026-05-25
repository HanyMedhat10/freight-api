import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export abstract class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  // @IsStrongPassword()
  password!: string;
}
