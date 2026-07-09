import { BookingStatus } from "../../../generated/prisma/enums";

export interface CreateBookingPayload {
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  address: string;
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}