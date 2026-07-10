import { Prisma } from "../../../generated/prisma/browser";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateBookingPayload, IBookingQuery, UpdateBookingStatusPayload } from "./booking.interface";
import httpStatus from "http-status";


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


const cancelBookingIntoDB = async (
  customerId: string,
  bookingId: string
) => {
  
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
    },
  });

  if (!booking) {
    throw new Error( "Booking not found");
  }

  // just user can cancel it
  if (
    booking.status !== BookingStatus.REQUESTED &&
    booking.status !== BookingStatus.ACCEPTED
  ) 
  
  {
    throw new Error(
      `Booking cannot be cancelled when status is ${booking.status}`
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
    include: {
      service: true,
      customer: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};


const updateBookingStatusIntoDB = async (
  userId: string,
  bookingId: string,
  payload: UpdateBookingStatusPayload
) => {

  // Technician Profile 
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  // Technician ar  Booking kina check kore
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      service: {
        technicianProfileId: technician.id,
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Workflow Validation

  if (
    payload.status === BookingStatus.ACCEPTED &&
    booking.status !== BookingStatus.REQUESTED
  ) {
    throw new Error("Only requested booking can be accepted");
  }

  if (
    payload.status === BookingStatus.DECLINED &&
    booking.status !== BookingStatus.REQUESTED
  ) {
    throw new Error("Only requested booking can be declined");
  }

  if (
    payload.status === BookingStatus.IN_PROGRESS &&
    booking.status !== BookingStatus.PAID
  ) {
    throw new Error("Booking must be paid first");
  }

  if (
    payload.status === BookingStatus.COMPLETED &&
    booking.status !== BookingStatus.IN_PROGRESS
  ) {
    throw new Error("Only in-progress booking can be completed");
  }

  const result = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: payload.status,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      service: {
        include: {
          category: true,
        },
      },
    },
  });

  return result;
};

const getMyBookingsFromDB = async (
  customerId: string,
  query: IBookingQuery
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.BookingWhereInput[] = [];

  // Login customer
  andConditions.push({
    customerId,
  });

  // Search (Service Title)
  if (query.searchTerm) {
    andConditions.push({
      service: {
        title: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  // Status Filter
  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  // Booking Date Filter
  if (query.bookingDate) {
    andConditions.push({
      bookingDate: new Date(query.bookingDate),
    });
  }

  const whereConditions: Prisma.BookingWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.booking.findMany({
    where: whereConditions,
    include: {
      service: {
        include: {
          category: true,
          technicianProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      },
      payment: true,
      review: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.booking.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};


export const bookingService = {
  createBookingIntoDB,
  cancelBookingIntoDB,
  updateBookingStatusIntoDB,
  getMyBookingsFromDB,
};