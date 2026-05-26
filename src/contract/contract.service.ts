import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import type { PaginatedResult, PaginationDto } from 'src/core/utility/pagination.dto';
import type { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}
  async create(createContractDto: CreateContractDto) {
    const clientId = createContractDto.clientId;
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const contract = this.contractRepository.create({
      ...createContractDto,
      client,
    });
    return await this.contractRepository.save(contract);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Contract>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.contractRepository.findAndCount({
      relations: { client: true },
      skip,
      take: limit,
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
    return await this.contractRepository.findOne({
      where: { id },
      relations: { client: true },
    });
  }
  async findClientContracts(user: User) {
    return  await this.contractRepository.findAndCount({
      where: { client: { id: user.id } },
      relations: { client: true },
    });
  }
  async update(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.findOne(id);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    if (updateContractDto.clientId) {
      const client = await this.userRepository.findOne({
        where: { id: updateContractDto.clientId },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      contract.client = client;
    }
    Object.assign(contract, updateContractDto);
    return await this.contractRepository.save(contract);
  }

  async remove(id: string) {
    return await this.contractRepository.softDelete(id);
  }
}
