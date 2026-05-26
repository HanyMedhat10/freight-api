import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsPositive,
} from 'class-validator';

export class CreateContractDto {
  @ApiProperty({
    example: 'Ro-Ro Freight Contract',
    description: 'The primary title of the freight contract',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    example:
      'Delivery at Alexandria Port within 30 business days. Insurance costs are covered by the forwarder...',
    description: 'The comprehensive terms and conditions of the agreement',
  })
  @IsNotEmpty()
  @IsString()
  terms!: string;

  @ApiProperty({
    example: 4500.5,
    description: 'The total overall cost of the contract in USD',
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalCost!: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description:
      'The unique identifier (UUID) of the client associated with this contract',
  })
  @IsNotEmpty()
  @IsUUID() // Ensures the provided ID is a valid UUID format
  clientId!: string;
}
