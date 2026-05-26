import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/auth/entities/enum/user.enum';
import type { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CurrentUser } from 'src/core/utility/decorators/current-user.decorator';
import { PaginationDto } from 'src/core/utility/pagination.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import type { UpdateStatusWithTrackingDto } from './dto/update-status-with-tracking.dto';
import { ShipmentService } from './shipment.service';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(
    @Body() createShipmentDto: CreateShipmentDto,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.create(createShipmentDto, user);
  }
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.shipmentService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shipmentService.findOne(id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('my-shipments')
  getClientShipments(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.shipmentService.getClientShipments(user, paginationDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('my-shipments/:id')
  getClientShipmentById(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.shipmentService.getClientShipmentById(user, id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(id, updateShipmentDto);
  }
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.FORWARDER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/status')
  updateStatusWithTrackingLog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusWithTrackingDto: UpdateStatusWithTrackingDto,
  ) {
    return this.shipmentService.updateStatusWithTrackingLog(
      id,
      updateStatusWithTrackingDto,
    );
  }
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shipmentService.remove(id);
  }
}
