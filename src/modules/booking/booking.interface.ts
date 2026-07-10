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
  searchTerm?: string;

  status?: string;
  categoryId?: string;
  customerId?: string;
  technicianId?: string;

  minPrice?: string;
  maxPrice?: string;

  bookingDate?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;
}