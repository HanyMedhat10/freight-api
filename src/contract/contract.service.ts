import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import type {
  PaginatedResult,
  PaginationDto,
} from 'src/core/utility/pagination.dto';
import { paginate } from 'src/core/utility/paginate';
import { Repository } from 'typeorm';
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
    const client = await this.userRepository.findOneBy({
      id: createContractDto.clientId,
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

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Contract>> {
    return paginate(this.contractRepository, paginationDto, {
      relations: { client: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: { client: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with id "${id}" not found`);
    }
    return contract;
  }

  async findClientContracts(user: User, paginationDto: PaginationDto) {
    return paginate(this.contractRepository, paginationDto, {
      where: { client: { id: user.id } },
      relations: { client: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.findOne(id);
    const { clientId, ...rest } = updateContractDto;
    Object.assign(contract, rest);

    if (clientId) {
      const client = await this.userRepository.findOneBy({ id: clientId });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      contract.client = client;
    }

    return await this.contractRepository.save(contract);
  }

  async remove(id: string) {
    const result = await this.contractRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contract with id "${id}" not found`);
    }
    return result;
  }
}
