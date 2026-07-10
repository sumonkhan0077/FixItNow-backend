import { prisma } from "../../lib/prisma";
import { CreateAvailabilityPayload } from "./technicianAvailability.interface";

const createAvailabilityIntoDB = async (
  userId: string,
  payload: CreateAvailabilityPayload
) => {
 
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  
  const isExist = await prisma.availability.findFirst({
    where: {
      technicianProfileId: technician.id,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,
    },
  });

  if (isExist) {
    throw new Error("This availability slot already exists.");
  }

  const result = await prisma.availability.create({
    data: {
      technicianProfileId: technician.id,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,
    },
  });

  return result;
};

const getMyAvailabilityFromDB = async (userId: string) => {
  
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  
  const result = await prisma.availability.findMany({
    where: {
      technicianProfileId: technician.id,
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  return result;
};

export const availabilityService = {
  createAvailabilityIntoDB,
  getMyAvailabilityFromDB,
};