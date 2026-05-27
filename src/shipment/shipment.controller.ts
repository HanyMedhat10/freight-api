import {
  applyDecorators,
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
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CurrentUser } from 'src/core/utility/decorators/current-user.decorator';
import {
  PaginationDto,
  type PaginatedResult,
} from 'src/core/utility/pagination.dto';
import type { UpdateResult } from 'typeorm/browser/query-builder/result/UpdateResult.js';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { UpdateStatusWithTrackingDto } from './dto/update-status-with-tracking.dto';
import { Shipment } from './entities/shipment.entity'; // adjust path as needed
import type { TrackingLog } from './entities/tracking-log.entity';
import { ShipmentService } from './shipment.service';

// ─── Shared Swagger error responses ──────────────────────────────────────────
const CommonErrorResponses = () =>
  applyDecorators(
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'Insufficient role permissions.' }),
    ApiBadRequestResponse({ description: 'Validation failed or bad input.' }),
  );
// ─────────────────────────────────────────────────────────────────────────────

@ApiTags('Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shipment successfully created.',
    type: Shipment,
  })
  @CommonErrorResponses()
  create(
    @Body() createShipmentDto: CreateShipmentDto,
    @CurrentUser() user: User,
  ): Promise<Shipment> {
    return this.shipmentService.create(createShipmentDto, user);
  }

  // ── Read (Admin) ────────────────────────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all shipments (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of all shipments.',
    type: [Shipment],
  })
  @CommonErrorResponses()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Shipment>> {
    return await this.shipmentService.findAll(paginationDto);
  }

  // ── Read (Current user) ─────────────────────────────────────────────────────
  //
  // ⚠️  These MUST be declared before @Get(':id') so NestJS doesn't greedily
  //     match the literal string "my" as a UUID parameter.

  @Get('my')
  @ApiOperation({
    summary: 'Retrieve all shipments belonging to the current user',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Paginated list of the current user's shipments.",
    type: [Shipment],
  })
  @CommonErrorResponses()
  getClientShipments(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Shipment>> {
    return this.shipmentService.getClientShipments(user, paginationDto);
  }

  @Get('my/:id')
  @ApiOperation({
    summary: 'Retrieve a specific shipment belonging to the current user',
  })
  @ApiParam({ name: 'id', description: 'Shipment UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment details for the current user.',
    type: Shipment,
  })
  @ApiNotFoundResponse({
    description: 'Shipment not found or does not belong to user.',
  })
  @CommonErrorResponses()
  getClientShipmentById(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Shipment | null> {
    return this.shipmentService.getClientShipmentById(user, id);
  }

  // ── Read (Admin, by ID) ─────────────────────────────────────────────────────

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific shipment by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Shipment UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment details.',
    type: Shipment,
  })
  @ApiNotFoundResponse({ description: 'Shipment not found.' })
  @CommonErrorResponses()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Shipment | null> {
    return this.shipmentService.findOne(id);
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update shipment details (Admin only)' })
  @ApiParam({ name: 'id', description: 'Shipment UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment successfully updated.',
    type: Shipment,
  })
  @ApiNotFoundResponse({ description: 'Shipment not found.' })
  @CommonErrorResponses()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ): Promise<Shipment | null> {
    return this.shipmentService.update(id, updateShipmentDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.FORWARDER)
  @ApiOperation({
    summary:
      'Update shipment status and append a tracking log entry (Admin, Forwarder)',
  })
  @ApiParam({ name: 'id', description: 'Shipment UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment status and tracking log successfully updated.',
    type: Shipment,
  })
  @ApiNotFoundResponse({ description: 'Shipment not found.' })
  @CommonErrorResponses()
  updateStatusWithTrackingLog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusWithTrackingDto: UpdateStatusWithTrackingDto,
  ): Promise<TrackingLog> {
    return this.shipmentService.updateStatusWithTrackingLog(
      id,
      updateStatusWithTrackingDto,
    );
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a shipment (Admin only)' })
  @ApiParam({ name: 'id', description: 'Shipment UUID', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Shipment successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Shipment not found.' })
  @CommonErrorResponses()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<UpdateResult> {
    return this.shipmentService.remove(id);
  }
}
