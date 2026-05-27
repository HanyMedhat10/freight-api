import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword!: string;

  @ApiProperty({ description: 'New password (must be strong)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  newPassword!: string;
}
