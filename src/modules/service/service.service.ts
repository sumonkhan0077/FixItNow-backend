import { Prisma, Role } from "../../../generated/prisma/client";
import { ServiceScalarWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  CreateServicePayload,
  IServicesQuery,
  UpdateServicePayload,
} from "./service.interface";

const createServiceIntoDB = async (
  userId: string,
  payload: CreateServicePayload,
) => {
  // Technician Profile
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
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

const getAllServicesFromDB = async (query: IServicesQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  //   const andConditions : ServiceScalarWhereInput[] = []
  const andConditions: Prisma.ServiceWhereInput[] = [];

  //search kora
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  // Price Filter
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }

  // Service Area Filter
  if (query.serviceArea) {
    andConditions.push({
      technicianProfile: {
        serviceArea: {
          contains: query.serviceArea,
          mode: "insensitive",
        },
      },
    });
  }

  // Rating Filter
  if (query.rating) {
    andConditions.push({
      technicianProfile: {
        averageRating: {
          gte: Number(query.rating),
        },
      },
    });
  }

  const result = await prisma.service.findMany({
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    where: {
      AND: andConditions,
    },

    // dynamic pagination and sorting

    take: limit,
    skip: skip,

    orderBy: {
      // sortBy : sortOrder
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.service.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyServicesFromDB = async (userId: string) => {
  // Technician Profile
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const result = await prisma.service.findMany({
    where: {
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateServiceIntoDB = async (
  userId: string,
  serviceId: string,
  payload: UpdateServicePayload,
) => {
  // Technician Profile
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const service = await prisma.service.findFirstOrThrow({
    where: {
      id: serviceId,
      technicianProfileId: technicianProfile.id,
    },
  });

  // check Category have,
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Update
  const result = await prisma.service.update({
    where: {
      id: service.id,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const getSingleServiceFromDB = async (serviceId: string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
          availabilities: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
            orderBy: [
              {
                dayOfWeek: "asc",
              },
              {
                startTime: "asc",
              },
            ],
          },
          reviews: {
            include: {
              customer: {
                omit: {
                  password: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  return service;
};

const deleteServiceFromDB = async (
  userId: string,
  role: Role,
  serviceId: string
) => {
  // Admin can any Service Delete 
  if (role === Role.ADMIN) {
    return await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });
  }

  // Login Technician
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  // Service Check
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      technicianProfileId: technician.id,
    },
  });

  if (!service) {
    throw new Error(
      "Service not found"
    );
  }

  return await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });
};

export const serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getMyServicesFromDB,
  updateServiceIntoDB,
  getSingleServiceFromDB,
  deleteServiceFromDB,
};
