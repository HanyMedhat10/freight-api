import { OmitType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';

export class UpdateShipmentDto extends OmitType(CreateShipmentDto, [
  'clientId',
]) {}
