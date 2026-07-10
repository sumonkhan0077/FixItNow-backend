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

export interface IBookingQuery {
  categoryId?:string;
  searchTerm?: string;

  status?: string;
  bookingDate?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;
}
