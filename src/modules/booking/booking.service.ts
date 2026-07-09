import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateBookingPayload } from "./booking.interface";

const createBookingIntoDB = async (
  customerId: string,
  payload: CreateBookingPayload
) => {
  // Service exists?
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      serviceId: payload.serviceId,
      bookingDate: new Date(payload.bookingDate),
      timeSlot: payload.timeSlot,
      address: payload.address,

      // Service price to booking price
      totalAmount: service.price,

      status: BookingStatus.REQUESTED,
    },
    include: {
      customer: true,
      service: {
        include: {
          category: true,
        },
      },
    },
  });

  return result;
};

export const bookingService = {
  createBookingIntoDB,
};