import { ServiceScalarWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateServicePayload, IServicesQuery } from "./service.interface";

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


const getAllServicesFromDB = async (query: IServicesQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions : ServiceScalarWhereInput[] = []
//   const andConditions: Prisma.ServicesWhereInput[] = [];


 //search kora
  if(query.searchTerm){
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
};