import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { User } from 'src/auth/entities/user.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import type {
  PaginatedResult,
  PaginationDto,
} from 'src/core/utility/pagination.dto';
import { paginate } from 'src/core/utility/paginate';
import { DataSource, Repository } from 'typeorm';
import { VALID_STATUS_TRANSITIONS } from './constants/status-transitions';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import type { UpdateStatusWithTrackingDto } from './dto/update-status-with-tracking.dto';
import { Shipment } from './entities/shipment.entity';
import { TrackingLog } from './entities/tracking-log.entity';

@Injectable()
export class ShipmentService {
  private readonly CUBIC_CENTIMETERS_PER_CUBIC_METER = 1_000_000;

  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(TrackingLog)
    private readonly trackingLogRepository: Repository<TrackingLog>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createShipmentDto: CreateShipmentDto, user: User) {
    const { origin, destination, length, width, height, weight, contractId } =
      createShipmentDto;

    // Validate that the contract exists and belongs to the user (or user is admin)
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: { client: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with id "${contractId}" not found`);
    }

    const calculatedCbm =
      (length * width * height) / this.CUBIC_CENTIMETERS_PER_CUBIC_METER;

    const shipment = this.shipmentRepository.create({
      origin,
      destination,
      length,
      width,
      height,
      weight,
      calculatedCbm,
      client: user,
      contract,
    });
    return await this.shipmentRepository.save(shipment);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Shipment>> {
    return paginate(this.shipmentRepository, paginationDto, {
      relations: { client: true, contract: true, trackingLogs: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: { client: true, contract: true, trackingLogs: true },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment with id "${id}" not found`);
    }
    return shipment;
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

      // 2. Validate state transition
      const allowedNextStatuses = VALID_STATUS_TRANSITIONS[shipment.status];
      if (!allowedNextStatuses.includes(updateStatusWithTrackingDto.status)) {
        throw new BadRequestException(
          `Cannot transition from "${shipment.status}" to "${updateStatusWithTrackingDto.status}". ` +
            `Allowed transitions: ${allowedNextStatuses.join(', ') || 'none (terminal state)'}`,
        );
      }

      // 3. Update the status
      shipment.status = updateStatusWithTrackingDto.status;
      await manager.save(shipment);

      // 4. Create the Tracking log
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
    return paginate(this.shipmentRepository, paginationDto, {
      where: { client: { id: user.id } },
      relations: { client: true, contract: true, trackingLogs: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getClientShipmentById(user: User, id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { client: { id: user.id }, id },
      relations: { client: true, contract: true, trackingLogs: true },
    });
    if (!shipment) {
      throw new NotFoundException(
        `Shipment with id "${id}" not found for current user`,
      );
    }
    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.findOne(id);
    Object.assign(shipment, updateShipmentDto);
    return await this.shipmentRepository.save(shipment);
  }

  async remove(id: string) {
    const result = await this.shipmentRepository.softDelete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Shipment with id "${id}" not found`);
    }
    return result;
  }
}
