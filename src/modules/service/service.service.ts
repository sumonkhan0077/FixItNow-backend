import { prisma } from "../../lib/prisma";
import { CreateServicePayload } from "./service.interface";

const createServiceIntoDB = async (
  userId: string,
  payload: CreateServicePayload
) => {
  // Technician Profile
  const technicianProfile =
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        userId,
      },
    });

  // Category?
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  // Service Create
  const result = await prisma.service.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      categoryId: payload.categoryId,
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
      technicianProfile: true,
    },
  });

  return result;
};

export const serviceService = {
  createServiceIntoDB,
};