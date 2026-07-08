import { prisma } from "../../lib/prisma";
import { CreateTechnicianProfilePayload } from "./technicianProfile.interface";

const createTechnicianProfileIntoDB = async (
  userId: string,
  payload: CreateTechnicianProfilePayload
) => {

  const isProfileExist = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (isProfileExist) {
    throw new Error("Technician profile already exists");
  }

  const result = await prisma.technicianProfile.create({
    data: {
      userId,
      ...payload,
    },
  });

  return result;
};

export const technicianProfileService = {
  createTechnicianProfileIntoDB,
//   updateTechnicianProfileIntoDB,
};