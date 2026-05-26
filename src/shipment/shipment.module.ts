import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { TrackingLog } from './entities/tracking-log.entity';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, TrackingLog])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
