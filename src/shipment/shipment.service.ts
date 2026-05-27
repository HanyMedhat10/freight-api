import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { User } from 'src/auth/entities/user.entity';
import type {
  PaginatedResult,
  PaginationDto,
} from 'src/core/utility/pagination.dto';
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
  CUBIC_CENTIMETERS_PER_CUBIC_METER = 1_000_000;
  async create(createShipmentDto: CreateShipmentDto, user: User) {
    const { origin, destination, length, width, height, weight, contractId } =
      createShipmentDto;
    // Here you would typically save the shipment to the database
    const calculatedCbm = (length * width * height) / this.CUBIC_CENTIMETERS_PER_CUBIC_METER; // Convert to cubic meters
    const shipment = this.shipmentRepository.create({
      origin,
      destination,
      length,
      width,
      height,
      weight,
      calculatedCbm,
      client: user, // Assuming you have a User entity with an id field
      contract: { id: contractId }, // Set the contract using the contractId
    });
    return await this.shipmentRepository.save(shipment);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Shipment>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.shipmentRepository.findAndCount({
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
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
    return await this.dataSource.transaction(async (manager) => {
      // 1. Fetch the shipment and lock it (Row-Level Lock) until the transaction is completed
      const shipment = await manager.findOne(Shipment, {
        where: { id: shipmentId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }

      // (Here you can add any Business Logic or Validation based on the current shipment data)

      // 2. Update the status
      shipment.status = updateStatusWithTrackingDto.status;
      await manager.save(shipment);

      // 3. Create the Tracking log
      const trackingLog = manager.create(TrackingLog, {
        shipment,
        location: updateStatusWithTrackingDto.location,
        description: updateStatusWithTrackingDto.description,
      });

      return await manager.save(trackingLog);
    });
  }

  async getClientShipments(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Shipment>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.shipmentRepository.findAndCount({
      where: { client: { id: user.id } },
      relations: {
        client: true,
        contract: true,
        trackingLogs: true,
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
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
    await this.shipmentRepository.update(id, {
      ...updateShipmentDto,
    });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.shipmentRepository.softDelete({ id });
  }
}
