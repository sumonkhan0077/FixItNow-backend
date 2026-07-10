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



const updateTechnicianProfileIntoDB = async (
  userId: string,
  payload: Partial<CreateTechnicianProfilePayload>
) => {
  
  const isProfileExist = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  // Update Profile
  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      userId,
    },
    data: {
      ...payload,
    },
  });

  return updatedProfile;
};

const getMyTechnicianProfileFromDB = async (userId: string) => {
  const result = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          role: true,
          status: true,
        },
      },
      services: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      reviews: true,
    },
  });

  if (!result) {
    throw new Error(
      "Technician profile not found"
    );
  }

  return result;
};

export const technicianProfileService = {
  createTechnicianProfileIntoDB,
  updateTechnicianProfileIntoDB,
  getMyTechnicianProfileFromDB,
};

