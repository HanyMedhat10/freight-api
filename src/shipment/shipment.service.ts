import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { User } from 'src/auth/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import type { UpdateStatusWithTrackingDto } from './dto/update-status-with-tracking.dto';
import { Shipment } from './entities/shipment.entity';
import { TrackingLog } from './entities/tracking-log.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(TrackingLog)
    private readonly trackingLogRepository: Repository<TrackingLog>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createShipmentDto: CreateShipmentDto,user: User) {
    const { origin, destination, length, width, height, weight } =
      createShipmentDto;
    // Here you would typically save the shipment to the database
    const calculatedCbm = (length * width * height) / 1_000_000; // Convert to cubic meters
    const shipment = this.shipmentRepository.create({
      origin,
      destination,
      length,
      width,
      height,
      weight,
      calculatedCbm,
      client: user, // Assuming you have a User entity with an id field
    });
    return await this.shipmentRepository.save(shipment);
  }

  async findAll() {
    return await this.shipmentRepository.find({
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.shipmentRepository.findOne({
      where: { id },
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
    });
  }
  async updateStatusWithTrackingLog(
    shipmentId: string,
    updateStatusWithTrackingDto: UpdateStatusWithTrackingDto,
  ) {
    // Implementation for updating shipment status with tracking log
    const shipment = await this.findOne(shipmentId);
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    // Use a single transaction to ensure both operations succeed or fail together
    return await this.dataSource.transaction(async (manager) => {
      // Update the shipment status
      shipment.status = updateStatusWithTrackingDto.status;
      await manager.save(shipment);

      // Create a new tracking log
      const trackingLog = manager.create(TrackingLog, {
        shipment,
        location: updateStatusWithTrackingDto.location,
        description: updateStatusWithTrackingDto.description,
      });
      return await manager.save(trackingLog);
    });
  }
  async getClientShipments(user: User) {
    return await this.shipmentRepository.find({
      where: { client: { id: user.id } },
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
    });
  }
  async getClientShipmentById(user: User, id: string) {
    return await this.shipmentRepository.findOne({
      where: { client: { id: user.id }, id },
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
    });
  }
  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });
    Object.assign(shipment!, updateShipmentDto);
    return await this.shipmentRepository.save(shipment!);
  }

  async remove(id: string) {
    return await this.shipmentRepository.softDelete({ id });
  }
}
