import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

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
}
