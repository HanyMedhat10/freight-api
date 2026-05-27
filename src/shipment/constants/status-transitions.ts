import { ShipmentStatus } from '../entities/enum/shipment-status.enum';

/**
 * Defines the valid state transitions for shipment statuses.
 * Terminal states (DELIVERED, CANCELLED) have no outgoing transitions.
 */
export const VALID_STATUS_TRANSITIONS: Record<
  ShipmentStatus,
  ShipmentStatus[]
> = {
  [ShipmentStatus.PENDING]: [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.IN_TRANSIT]: [
    ShipmentStatus.CUSTOMS_CLEARANCE,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.CUSTOMS_CLEARANCE]: [
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.DELIVERED]: [],
  [ShipmentStatus.CANCELLED]: [],
};
