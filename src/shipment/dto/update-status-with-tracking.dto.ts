import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ShipmentStatus } from '../entities/enum/shipment-status.enum';

export class UpdateStatusWithTrackingDto {
  //   shipmentId!: string;
  @ApiProperty({ enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;
}
