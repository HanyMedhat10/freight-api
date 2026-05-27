import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({
    example: 'Shanghai, China',
    description: 'Origin port or city',
  })
  @IsString()
  @IsNotEmpty()
  origin!: string;

  @ApiProperty({
    example: 'Alexandria, Egypt',
    description: 'Destination port or city',
  })
  @IsString()
  @IsNotEmpty()
  destination!: string;

  @ApiProperty({ example: 120, description: 'Length in centimeters' })
  @IsNumber()
  @IsPositive()
  length!: number;

  @ApiProperty({ example: 80, description: 'Width in centimeters' })
  @IsNumber()
  @IsPositive()
  width!: number;

  @ApiProperty({ example: 100, description: 'Height in centimeters' })
  @IsNumber()
  @IsPositive()
  height!: number;

  @ApiProperty({ example: 250.5, description: 'Weight in kilograms' })
  @IsNumber()
  @IsPositive()
  weight!: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the associated contract',
  })
  @IsNotEmpty()
  @IsUUID()
  contractId!: string;
}
