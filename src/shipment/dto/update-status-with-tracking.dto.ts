import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ShipmentStatus } from '../entities/enum/shipment-status.enum';

export class UpdateStatusWithTrackingDto {
  @ApiProperty({
    enum: ShipmentStatus,
    description: 'New shipment status',
  })
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @ApiProperty({
    example: 'Alexandria Port',
    description: 'Current location of the shipment',
  })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({
    example: 'Shipment cleared customs and is ready for pickup',
    description: 'Tracking log description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
