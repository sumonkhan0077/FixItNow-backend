
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload } from "./review.interface";

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

export const reviewService = {
  createReviewIntoDB,
};