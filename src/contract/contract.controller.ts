import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from 'src/auth/entities/enum/user.enum';
import type { User } from 'src/auth/entities/user.entity';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/core/utility/decorators/current-user.decorator';
import { PaginationDto } from 'src/core/utility/pagination.dto';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new contract (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Contract successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Validation failed or bad input.' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions.' })
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  // ⚠️ Must be declared BEFORE @Get(':id') to avoid route shadowing
  @Get('my-contracts')
  @Roles(Role.CLIENT, Role.ADMIN)
  @ApiOperation({
    summary: 'Retrieve contracts belonging to the current user',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Paginated list of the current user's contracts.",
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  getClientContracts(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.contractService.findClientContracts(user, paginationDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all contracts (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of all contracts.',
  })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contractService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve a contract by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contract UUID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract details.' })
  @ApiNotFoundResponse({ description: 'Contract not found.' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a contract (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contract UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contract successfully updated.',
  })
  @ApiNotFoundResponse({ description: 'Contract not found.' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(id, updateContractDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a contract (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contract UUID', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Contract successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Contract not found.' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contractService.remove(id);
  }
}
