
import { Prisma } from "../../../generated/prisma/browser";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload, IReviewQuery } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: CreateReviewPayload
) => {

  //   console.log("customerId =", customerId);
  // console.log("payload =", payload);

  const { bookingId, rating, comment } = payload;

  // check booking ?
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Booking Completed 
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can review only after job completion");
  }

  //  Review match by booking id
  const isReviewExist = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (isReviewExist) {
    throw new Error("You already reviewed this booking");
  }

  // Technician Profile 
  const technicianProfileId = booking.service.technicianProfileId;

  // Review Create
  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianProfileId,
      rating,
      comment,
    },
  });

  // all Rating ber kora
  const reviews = await prisma.review.findMany({
    where: {
      technicianProfileId,
    },
  });

  const totalRating = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  const averageRating = totalRating / reviews.length;

  // TechnicianProfile Update
  await prisma.technicianProfile.update({
    where: {
      id: technicianProfileId,
    },
    data: {
      averageRating,
    },
  });

  return review;
};

const deleteReviewFromDB = async (reviewId: string) => {
  // Review আছে কিনা
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // আগে Delete করো
  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  // বাকি Review-এর Average বের করো
  const result = await prisma.review.aggregate({
    where: {
      technicianProfileId: review.technicianProfileId,
    },
    _avg: {
      rating: true,
    },
  });

  // Technician Profile Update
  await prisma.technicianProfile.update({
    where: {
      id: review.technicianProfileId,
    },
    data: {
      averageRating: result._avg.rating ?? 0,
    },
  });

  return null;
};


const getSingleReviewFromDB = async (reviewId: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      booking: true,
    },
  });

  return review;
};


const getAllReviewsFromDB = async (query: IReviewQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.ReviewWhereInput[] = [];

  // Search by comment
  if (query.searchTerm) {
    andConditions.push({
      comment: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    });
  }

  // Rating Filter
  if (query.rating) {
    andConditions.push({
      rating: Number(query.rating),
    });
  }

  // Customer Filter
  if (query.customerId) {
    andConditions.push({
      customerId: query.customerId,
    });
  }

  // Technician Filter
  if (query.technicianProfileId) {
    andConditions.push({
      technicianProfileId: query.technicianProfileId,
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const data = await prisma.review.findMany({
    where: whereConditions,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
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
      booking: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.review.count({
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

export const reviewService = {
  createReviewIntoDB,
  deleteReviewFromDB,
  getSingleReviewFromDB,
  getAllReviewsFromDB,
};