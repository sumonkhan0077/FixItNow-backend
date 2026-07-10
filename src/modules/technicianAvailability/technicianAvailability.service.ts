import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateAvailabilityPayload, UpdateAvailabilityPayload } from "./technicianAvailability.interface";

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

const updateAvailabilityIntoDB = async (
  userId: string,
  role: Role,
  availabilityId: string,
  payload: UpdateAvailabilityPayload
) => {
  
  if (role === Role.ADMIN) {
    return await prisma.availability.update({
      where: {
        id: availabilityId,
      },
      data: payload,
    });
  }

  
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const slot = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      technicianProfileId: technician.id,
    },
  });

  if (!slot) {
    throw new Error(
      "Availability slot not found"
    );
  }

  // Update
  return await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: payload,
  });
};

const deleteAvailabilityFromDB = async (
  userId: string,
  role: Role,
  availabilityId: string
) => {
  // Admin can any Slot Delete 
  if (role === Role.ADMIN) {
    return await prisma.availability.delete({
      where: {
        id: availabilityId,
      },
    });
  }

  // Login Technician Profile
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  // Slot Check
  const slot = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      technicianProfileId: technician.id,
    },
  });

  if (!slot) {
    throw new Error(
      "Availability slot not found"
    );
  }

  // Delete
  return await prisma.availability.delete({
    where: {
      id: availabilityId,
    },
  });
};

export const availabilityService = {
  createAvailabilityIntoDB,
  getMyAvailabilityFromDB,
  updateAvailabilityIntoDB,
  deleteAvailabilityFromDB
};