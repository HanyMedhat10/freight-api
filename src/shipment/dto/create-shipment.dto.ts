import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  origin!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination!: string;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  length!: number;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  width!: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  height!: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  weight!: number;
  /* @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  clientId!: string; */
}
