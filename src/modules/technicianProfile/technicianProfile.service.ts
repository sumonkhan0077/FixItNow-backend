import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { CreateTechnicianProfilePayload, ITechnicianProfileQuery } from "./technicianProfile.interface";

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

//get single 
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
       availabilities: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!result) {
    throw new Error(
      "Technician profile not found"
    );
  }

  return result;
};


//get all tec profile
const getAllTechnicianProfilesFromDB = async (
  query: ITechnicianProfileQuery
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.TechnicianProfileWhereInput[] = [];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          serviceArea: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Experience Filter
  if (query.experience) {
    andConditions.push({
      experience: {
        gte: Number(query.experience),
      },
    });
  }

  // Rating Filter
  if (query.rating) {
    andConditions.push({
      averageRating: {
        gte: Number(query.rating),
      },
    });
  }

  // Service Area Filter
  if (query.serviceArea) {
    andConditions.push({
      serviceArea: {
        contains: query.serviceArea,
        mode: "insensitive",
      },
    });
  }

  const whereConditions: Prisma.TechnicianProfileWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.technicianProfile.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          status: true,
        },
      },
      services: {
        include: {
          category: true,
        },
      },
      availabilities: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
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
      _count: {
        select: {
          services: true,
          reviews: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.technicianProfile.count({
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

const getSingleTechnicianProfileFromDB = async (id: string) => {
  const result = await prisma.technicianProfile.findUnique({
    where: {
      id,
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
      availabilities: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
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
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
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
  getAllTechnicianProfilesFromDB,
  getSingleTechnicianProfileFromDB

};

